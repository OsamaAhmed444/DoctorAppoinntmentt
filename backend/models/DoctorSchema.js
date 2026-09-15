import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
    required: true
  },

  image: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  experienceYears: {
    type: Number,
    required: true,
    min: 0
  }
});

const Doctor = mongoose.model("Doctor", DoctorSchema);

export default Doctor;