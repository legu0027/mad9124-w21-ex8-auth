import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  firstName: { type: String, trim: true, maxlength: 64, required: true },
  lastName: { type: String, trim: true, maxlength: 64 },
  email: { type: String, trim: true, maxlength: 512, required: true, unique: true },
  password: { type: String, trim: true, maxlength: 70, required: true }
})

const Model = mongoose.model('User', schema) // factory function returns a class

export default Model