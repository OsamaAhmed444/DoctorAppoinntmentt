import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  image: {
    type: String
  }
});

const Departments = mongoose.model(
  "Departments",
  departmentSchema
);

export default Departments;