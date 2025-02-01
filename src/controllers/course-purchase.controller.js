import { coursePurchaseService } from '~/services/course-purchase.service'
import { asyncHandler } from '~/utils/async-handler'

const createCheckoutSession = asyncHandler(async (req, res) => {
  const userId = req.id
  const { courseId } = req.body

  const { checkoutUrl } = await coursePurchaseService.createCheckoutSession({
    userId,
    courseId
  })

  return res.status(200).json({
    success: true,
    url: checkoutUrl
  })
})

const stripeWebhook = asyncHandler(async (req, res) => {
  await stripeWebhook(req.body)
  res.status(200).send()
})

const getCourseDetailWithPurchaseStatus = asyncHandler(async (req, res) => {
  const data = await coursePurchaseService.getCourseDetailWithPurchaseStatus({
    userId: req.id,
    courseId: req.params.courseId
  })
  res.status(200).json(data)
})

const getAllPurchasedCourse = asyncHandler(async (_, res) => {
  const purchasedCourse = await coursePurchaseService.getAllPurchasedCourse()
  return res.status(200).json({
    purchasedCourse
  })
})

export const coursePurchaseController = {
  createCheckoutSession,
  stripeWebhook,
  getCourseDetailWithPurchaseStatus,
  getAllPurchasedCourse
}
