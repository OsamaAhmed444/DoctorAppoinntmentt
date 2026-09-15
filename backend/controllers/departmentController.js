import Departments from "../models/Departments.js";
import Doctor from "../models/DoctorSchema.js";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
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

export const addDepartment = async (
  req,
  res,
  next
) => {
  try {
    const { name, description } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      throw createError(
        "Department name is required",
        400
      );
    }

    const normalizedName = name.trim();

    const existingDepartment =
      await Departments.findOne({
        name: normalizedName
      });

    if (existingDepartment) {
      throw createError(
        "Department name already exists",
        400
      );
    }

    if (
      description !== undefined &&
      (
        typeof description !== "string" ||
        !description.trim()
      )
    ) {
      throw createError(
        "Description cannot be empty",
        400
      );
    }

    const department = await Departments.create({
      name: normalizedName,
      description:
        description !== undefined
          ? description.trim()
          : undefined,
      image: req.file?.filename
    });

    return res.status(201).json(department);
  } catch (error) {
    if (error.code === 11000) {
      error.statusCode = 400;
      error.message =
        "Department name already exists";
    }

    if (req.file && error.statusCode) {
      await deleteImageFile(req.file.filename);
    }

    next(error);
  }
};

export const getAllDepartments = async (
  req,
  res,
  next
) => {
  try {
    const departments =
      await Departments.find({})
        .sort({ name: 1 });

    return res.status(200).json(departments);
  } catch (error) {
    next(error);
  }
};

export const getDepartmentsCount = async (
  req,
  res,
  next
) => {
  try {
    const count =
      await Departments.countDocuments();

    return res.status(200).json({
      count
    });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      if (req.file) {
        await deleteImageFile(req.file.filename);
      }

      throw createError(
        "Invalid department ID",
        400
      );
    }

    const department =
      await Departments.findById(id);

    if (!department) {
      if (req.file) {
        await deleteImageFile(req.file.filename);
      }

      throw createError(
        "Department not found",
        404
      );
    }

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        throw createError(
          "Department name cannot be empty",
          400
        );
      }

      const normalizedName = name.trim();

      if (normalizedName !== department.name) {
        const existingDepartment =
          await Departments.findOne({
            name: normalizedName,
            _id: { $ne: id }
          });

        if (existingDepartment) {
          throw createError(
            "Department name already exists",
            400
          );
        }
      }

      department.name = normalizedName;
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        throw createError(
          "Description must be valid text",
          400
        );
      }

      department.description =
        description.trim();
    }

    const oldImage = department.image;

    if (req.file) {
      department.image = req.file.filename;
    }

    try {
      await department.save();
    } catch (error) {
      if (req.file) {
        await deleteImageFile(req.file.filename);
      }

      if (error.code === 11000) {
        error.statusCode = 400;
        error.message =
          "Department name already exists";
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

    return res.status(200).json({
      message: "Department updated successfully",
      department
    });
  } catch (error) {
    if (
      req.file &&
      !error.statusCode &&
      error.code !== 11000
    ) {
      await deleteImageFile(req.file.filename);
    }

    next(error);
  }
};

export const deleteDepartment = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(
        "Invalid department ID",
        400
      );
    }

    const department =
      await Departments.findById(id);

    if (!department) {
      throw createError(
        "Department not found",
        404
      );
    }

    const doctorsCount =
      await Doctor.countDocuments({
        department: id
      });

    if (doctorsCount > 0) {
      throw createError(
        "Cannot delete department because it has doctors assigned to it",
        400
      );
    }

    const oldImage = department.image;

    await department.deleteOne();

    await deleteImageFile(oldImage);

    return res.status(200).json({
      message:
        "Department deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};