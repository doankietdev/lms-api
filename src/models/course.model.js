import mongoose from 'mongoose'
import { COURSE_LEVELS } from '~/utils/constants'

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true
    },
    subTitle: { type: String, default: '' },
    description: { type: String, default: '' },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category'
    },
    courseLevel: {
      type: String,
      enum: Object.values(COURSE_LEVELS),
      default: COURSE_LEVELS.BEGINNER
    },
    coursePrice: {
      type: Number,
      default: 0
    },
    courseThumbnail: {
      type: String,
      default: ''
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
      }
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export const Course = mongoose.model('Course', courseSchema)
