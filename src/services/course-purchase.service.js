import { StatusCodes } from 'http-status-codes'
import Stripe from 'stripe'
import { CLIENT_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '~/configs/env'
import { AppError } from '~/errors/app.error'
import { COURSE_FREE_ERROR, OWNER_CANNOT_PURCHASE_ERROR } from '~/errors/checkout.error'
import { CreateStripeSessionError, PurchaseNotFoundError } from '~/errors/course-purchase.error'
import { CourseNotFoundError } from '~/errors/course.error'
import { CoursePurchase } from '~/models/course-purchase.model'
import { Course } from '~/models/course.model'
import { User } from '~/models/user.model'

const stripe = new Stripe(STRIPE_SECRET_KEY)

const createCheckoutSession = async ({ userId, courseId }) => {
  const course = await Course.findById(courseId)
  if (!course) {
    throw AppError.from(CourseNotFoundError, StatusCodes.NOT_FOUND)
  }

  if (course.creator.equals(userId)) {
    throw AppError.from(OWNER_CANNOT_PURCHASE_ERROR, StatusCodes.BAD_REQUEST)
  }

  if (course.coursePrice === 0) {
    throw AppError.from(COURSE_FREE_ERROR, StatusCodes.BAD_REQUEST)
  }

  // Create a new course purchase record
  const newPurchase = new CoursePurchase({
    courseId,
    userId,
    amount: course.coursePrice,
    status: 'pending'
  })

  // Create a Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'USD',
          product_data: {
            name: course.courseTitle,
            images: [course.courseThumbnail]
          },
          unit_amount: Math.round(course.coursePrice * 100) // Amount in paise (lowest denomination)
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${CLIENT_URL}/course-progress/${courseId}`,
    cancel_url: `${CLIENT_URL}/course-detail/${courseId}`,
    metadata: {
      courseId: courseId,
      userId: userId
    }
  })

  if (!session.url) {
    throw AppError.from(CreateStripeSessionError, StatusCodes.INTERNAL_SERVER_ERROR)
  }

  // Save the purchase record
  newPurchase.paymentId = session.id
  await newPurchase.save()

  return {
    checkoutUrl: session.url
  }
}

const stripeWebhook = async (payload) => {
  const payloadString = JSON.stringify(payload, null, 2)

  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: STRIPE_WEBHOOK_SECRET
  })

  const event = stripe.webhooks.constructEvent(payloadString, header, STRIPE_WEBHOOK_SECRET)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const purchase = await CoursePurchase.findOne({
      paymentId: session.id
    }).populate({ path: 'courseId' })

    if (!purchase) {
      throw AppError.from(PurchaseNotFoundError, StatusCodes.NOT_FOUND)
    }

    if (session.amount_total) {
      purchase.amount = session.amount_total / 100
    }
    purchase.status = 'completed'

    await purchase.save()

    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
      { new: true }
    )

    // Update course to add user ID to enrolledStudents
    await Course.findByIdAndUpdate(
      purchase.courseId._id,
      { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
      { new: true }
    )
  }
}

const getCourseDetailWithPurchaseStatus = async ({ userId, courseId }) => {
  const course = await Course.findById(courseId)
    .populate({ path: 'creator', select: '-sub -role -enrolledCourses -createdAt -updatedAt' })
    .populate({ path: 'lectures' })
  if (!course) {
    throw AppError.from(CourseNotFoundError, StatusCodes.NOT_FOUND)
  }

  const coursePurchase = await CoursePurchase.findOne({ userId, courseId, status: 'completed' })

  const registeredUserId = course.enrolledStudents.find(studentId => studentId.equals(userId))

  return {
    course,
    isOwner: course.creator?._id.equals(userId),
    purchased: !!coursePurchase || !!registeredUserId
  }
}

const getAllPurchasedCourse = async () => {
  const purchasedCourse = await CoursePurchase.find({
    status: 'completed'
  }).populate('courseId')
  if (!purchasedCourse) {
    throw AppError.from(PurchaseNotFoundError, StatusCodes.NOT_FOUND)
  }
  return purchasedCourse
}

export const coursePurchaseService = {
  createCheckoutSession,
  stripeWebhook,
  getCourseDetailWithPurchaseStatus,
  getAllPurchasedCourse
}
