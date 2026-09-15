import express from "express";
import auth from "../auth/Middleware.js";

import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointment,
  deleteAppointment
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post(
  "/createAppointment",
  auth(),
  createAppointment
);

router.get(
  "/myAppointments",
  auth(),
  getMyAppointments
);

router.get(
  "/allAppointments",
  auth("admin"),
  getAllAppointments
);

router.put(
  "/updateAppointment/:id",
  auth(),
  updateAppointment
);

router.delete(
  "/deleteAppointment/:id",
  auth(),
  deleteAppointment
);

export default router;