import mongoose from 'mongoose'

const lectureProgressSchema = new mongoose.Schema({
  lectureId:{ type:String, required: true },
  viewed:{ type:Boolean, default: false }
})

const courseProgressSchema = new mongoose.Schema({
  userId:{ type:String, required: true },
  courseId:{ type:String, required: true },
  completed:{ type:Boolean, default: false },
  lectureProgress:[lectureProgressSchema]
})

export const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema)