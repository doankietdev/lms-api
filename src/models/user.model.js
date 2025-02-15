import mongoose from 'mongoose'
import { ROLES } from '~/utils/constants'

const userSchema = new mongoose.Schema(
  {
    sub: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: 'student'
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    photoUrl: {
      type: String,
      default: ''
    },
    photoPublicId: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

export const User = mongoose.model('User', userSchema)
