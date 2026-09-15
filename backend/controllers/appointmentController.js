import Appointment from "../models/AppointmentSchema.js";
import Doctor from "../models/DoctorSchema.js";
import mongoose from "mongoose";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const createAppointment = async (req, res, next) => {
  try {
    const { doctor, date, reason } = req.body;

    if (!doctor || !date || !reason) {
      throw createError(
        "Doctor, date and reason are required",
        400
      );
    }

    if (
      typeof doctor !== "string" ||
      !mongoose.Types.ObjectId.isValid(doctor)
    ) {
      throw createError(
        "Invalid doctor ID",
        400
      );
    }

    const existingDoctor =
      await Doctor.findById(doctor);

    if (!existingDoctor) {
      throw createError(
        "Doctor not found",
        404
      );
    }

    if (
      typeof reason !== "string" ||
      !reason.trim()
    ) {
      throw createError(
        "Reason cannot be empty",
        400
      );
    }

    if (reason.trim().length < 3) {
      throw createError(
        "Reason must be at least 3 characters",
        400
      );
    }

    if (
      typeof date !== "string" ||
      !date.trim()
    ) {
      throw createError(
        "Invalid appointment date",
        400
      );
    }

    const appointmentDate = new Date(date);

    if (Number.isNaN(appointmentDate.getTime())) {
      throw createError(
        "Invalid appointment date",
        400
      );
    }

    if (appointmentDate <= new Date()) {
      throw createError(
        "Appointment date must be in the future",
        400
      );
    }

    const appointment =
      await Appointment.create({
        user: req.user.id,
        doctor,
        date: appointmentDate,
        reason: reason.trim()
      });

    return res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (
  req,
  res,
  next
) => {
  try {
    const appointments =
      await Appointment.find({
        user: req.user.id
      })
        .populate({
          path: "doctor",
          populate: {
            path: "department"
          }
        })
        .sort({ date: 1 });

    return res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (
  req,
  res,
  next
) => {
  try {
    const appointments =
      await Appointment.find()
        .populate({
          path: "user",
          select: "name email"
        })
        .populate({
          path: "doctor",
          populate: {
            path: "department"
          }
        })
        .sort({ date: 1 });

    return res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { date, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(
        "Invalid appointment ID",
        400
      );
    }

    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      throw createError(
        "Appointment not found",
        404
      );
    }

    if (
      req.user.role !== "admin" &&
      appointment.user.toString() !==
        String(req.user.id)
    ) {
      throw createError(
        "Access denied. You can only update your own appointments.",
        403
      );
    }

    if (!date || !reason) {
      throw createError(
        "Date and reason are required",
        400
      );
    }

    if (
      typeof date !== "string" ||
      !date.trim()
    ) {
      throw createError(
        "Invalid appointment date",
        400
      );
    }

    const appointmentDate = new Date(date);

    if (Number.isNaN(appointmentDate.getTime())) {
      throw createError(
        "Invalid appointment date",
        400
      );
    }

    if (appointmentDate <= new Date()) {
      throw createError(
        "Appointment date must be in the future",
        400
      );
    }

    if (
      typeof reason !== "string" ||
      !reason.trim()
    ) {
      throw createError(
        "Reason cannot be empty",
        400
      );
    }

    if (reason.trim().length < 3) {
      throw createError(
        "Reason must be at least 3 characters",
        400
      );
    }

    appointment.date = appointmentDate;
    appointment.reason = reason.trim();

    await appointment.save();

    const updatedAppointment =
      await Appointment.findById(id)
        .populate({
          path: "doctor",
          populate: {
            path: "department"
          }
        });

    return res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(
        "Invalid appointment ID",
        400
      );
    }

    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      throw createError(
        "Appointment not found",
        404
      );
    }

    if (
      req.user.role !== "admin" &&
      appointment.user.toString() !==
        String(req.user.id)
    ) {
      throw createError(
        "Access denied. You can only delete your own appointments.",
        403
      );
    }

    await appointment.deleteOne();

    return res.status(200).json({
      message: "Appointment deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};