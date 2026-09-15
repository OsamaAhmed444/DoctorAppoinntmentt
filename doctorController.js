// ==================== Imports & Helpers ====================

import Doctor from "../models/DoctorSchema.js";
import Departments from "../models/Departments.js";
import Appointment from "../models/AppointmentSchema.js";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const deleteImageFile = async (filename) => {
  if (!filename) {
    return;
  }

  const safeFilename = path.basename(filename);
  const filePath = path.resolve("uploads", safeFilename);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(
        "Failed to delete image file:",
        error.message
      );
    }
  }
};


// ==================== Add Doctor ====================

export const addDoctor = async (req, res, next) => {
  try {
    const {
      name,
      department,
      description,
      experienceYears
    } = req.body;

    if (
      !name ||
      !department ||
      !description ||
      experienceYears === undefined ||
      experienceYears === null ||
      experienceYears === ""
    ) {
      throw createError(
        "Name, department, description and experienceYears are required",
        400
      );
    }

    if (typeof name !== "string" || !name.trim()) {
      throw createError(
        "Name must be valid text",
        400
      );
    }

    if (
      typeof description !== "string" ||
      !description.trim()
    ) {
      throw createError(
        "Description must be valid text",
        400
      );
    }

    if (
      typeof department !== "string" ||
      !mongoose.Types.ObjectId.isValid(department)
    ) {
      throw createError(
        "Invalid department ID",
        400
      );
    }

    const existingDepartment =
      await Departments.findById(department);

    if (!existingDepartment) {
      throw createError(
        "Department not found",
        404
      );
    }

    if (
      typeof experienceYears === "string" &&
      !experienceYears.trim()
    ) {
      throw createError(
        "Experience years cannot be empty",
        400
      );
    }

    const experience = Number(experienceYears);

    if (
      !Number.isFinite(experience) ||
      experience < 0
    ) {
      throw createError(
        "Experience years must be a valid number greater than or equal to 0",
        400
      );
    }

    if (!req.file) {
      throw createError(
        "Doctor image is required",
        400
      );
    }

    const doctor = new Doctor({
      name: name.trim(),
      department,
      description: description.trim(),
      experienceYears: experience,
      image: req.file.filename
    });

    try {
      await doctor.save();
    } catch (error) {
      await deleteImageFile(req.file.filename);
      throw error;
    }

    return res.status(201).json({
      message: "Doctor added successfully",
      doctor
    });
  } catch (error) {
    next(error);
  }
};


// ==================== Get All Doctors ====================

export const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({})
      .populate("department")
      .sort({ name: 1 });

    return res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};


// ==================== Search Doctors ====================

export const searchDoctors = async (req, res, next) => {
  try {
    const {
      search = "",
      department = "",
      page = 1,
      limit = 6
    } = req.query;

    if (
      typeof search !== "string" ||
      typeof department !== "string"
    ) {
      throw createError(
        "Search and department must be valid text",
        400
      );
    }

    const currentPage = Number(page);
    const doctorsPerPage = Number(limit);

    if (
      !Number.isInteger(currentPage) ||
      currentPage < 1
    ) {
      throw createError(
        "Page must be a positive integer",
        400
      );
    }

    if (
      !Number.isInteger(doctorsPerPage) ||
      doctorsPerPage < 1 ||
      doctorsPerPage > 50
    ) {
      throw createError(
        "Limit must be an integer between 1 and 50",
        400
      );
    }

    const filter = {};

    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      filter.name = {
        $regex: escapeRegex(trimmedSearch),
        $options: "i"
      };
    }

    const trimmedDepartment = department.trim();

    if (trimmedDepartment) {
      if (
        !mongoose.Types.ObjectId.isValid(
          trimmedDepartment
        )
      ) {
        throw createError(
          "Invalid department ID",
          400
        );
      }

      const existingDepartment =
        await Departments.findById(trimmedDepartment);

      if (!existingDepartment) {
        throw createError(
          "Department not found",
          404
        );
      }

      filter.department = trimmedDepartment;
    }

    const totalDoctors =
      await Doctor.countDocuments(filter);

    const totalPages = Math.ceil(
      totalDoctors / doctorsPerPage
    );

    const doctors = await Doctor.find(filter)
      .populate("department")
      .sort({ name: 1 })
      .skip(
        (currentPage - 1) * doctorsPerPage
      )
      .limit(doctorsPerPage);

    return res.status(200).json({
      doctors,
      totalDoctors,
      totalPages,
      currentPage,
      limit: doctorsPerPage
    });
  } catch (error) {
    next(error);
  }
};


// ==================== Get Doctors Count ====================

export const getDoctorsCount = async (req, res, next) => {
  try {
    const count = await Doctor.countDocuments();

    return res.status(200).json({
      count
    });
  } catch (error) {
    next(error);
  }
};


// ==================== Get Doctors By Department ====================

export const getDoctorsByDepartment = async (
  req,
  res,
  next
) => {
  try {
    const { departmentId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(departmentId)
    ) {
      throw createError(
        "Invalid department ID",
        400
      );
    }

    const department =
      await Departments.findById(departmentId);

    if (!department) {
      throw createError(
        "Department not found",
        404
      );
    }

    const doctors = await Doctor.find({
      department: departmentId
    })
      .populate("department")
      .sort({ name: 1 });

    return res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};


// ==================== Get Doctor By ID ====================

export const getDoctorById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(
        "Invalid doctor ID",
        400
      );
    }

    const doctor = await Doctor.findById(id)
      .populate("department");

    if (!doctor) {
      throw createError(
        "Doctor not found",
        404
      );
    }

    return res.status(200).json(doctor);
  } catch (error) {
    next(error);
  }
};


// ==================== Update Doctor ====================

export const updateDoctor = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(
        "Invalid doctor ID",
        400
      );
    }

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      if (req.file) {
        await deleteImageFile(req.file.filename);
      }

      throw createError(
        "Doctor not found",
        404
      );
    }

    const {
      name,
      department,
      description,
      experienceYears
    } = req.body;

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        throw createError(
          "Name must be valid text",
          400
        );
      }

      doctor.name = name.trim();
    }

    if (department !== undefined) {
      if (
        typeof department !== "string" ||
        !mongoose.Types.ObjectId.isValid(
          department
        )
      ) {
        throw createError(
          "Invalid department ID",
          400
        );
      }

      const existingDepartment =
        await Departments.findById(department);

      if (!existingDepartment) {
        throw createError(
          "Department not found",
          404
        );
      }

      doctor.department = department;
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        !description.trim()
      ) {
        throw createError(
          "Description must be valid text",
          400
        );
      }

      doctor.description = description.trim();
    }

    if (experienceYears !== undefined) {
      if (
        experienceYears === null ||
        experienceYears === ""
      ) {
        throw createError(
          "Experience years cannot be empty",
          400
        );
      }

      if (
        typeof experienceYears === "string" &&
        !experienceYears.trim()
      ) {
        throw createError(
          "Experience years cannot be empty",
          400
        );
      }

      const experience = Number(experienceYears);

      if (
        !Number.isFinite(experience) ||
        experience < 0
      ) {
        throw createError(
          "Experience years must be a valid number greater than or equal to 0",
          400
        );
      }

      doctor.experienceYears = experience;
    }

    const oldImage = doctor.image;

    if (req.file) {
      doctor.image = req.file.filename;
    }

    try {
      await doctor.save();
    } catch (error) {
      if (req.file) {
        await deleteImageFile(req.file.filename);
      }

      throw error;
    }

    if (
      req.file &&
      oldImage &&
      oldImage !== req.file.filename
    ) {
      await deleteImageFile(oldImage);
    }

    const updatedDoctor =
      await Doctor.findById(id)
        .populate("department");

    return res.status(200).json({
      message: "Doctor updated successfully",
      doctor: updatedDoctor
    });
  } catch (error) {
    next(error);
  }
};


// ==================== Delete Doctor ====================

export const deleteDoctor = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(
        "Invalid doctor ID",
        400
      );
    }

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      throw createError(
        "Doctor not found",
        404
      );
    }

    const appointmentsCount =
      await Appointment.countDocuments({
        doctor: id
      });

    if (appointmentsCount > 0) {
      throw createError(
        "Cannot delete doctor because there are appointments assigned to this doctor",
        400
      );
    }

    const oldImage = doctor.image;

    await doctor.deleteOne();

    await deleteImageFile(oldImage);

    return res.status(200).json({
      message: "Doctor deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};