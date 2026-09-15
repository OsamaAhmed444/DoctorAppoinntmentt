import express from "express";
import multer from "multer";
import path from "path";
import auth from "../auth/Middleware.js";

import {
  addDoctor,
  getAllDoctors,
  searchDoctors,
  getDoctorsCount,
  getDoctorsByDepartment,
  getDoctorById,
  updateDoctor,
  deleteDoctor
} from "../controllers/doctorController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },

  filename: function (req, file, cb) {
    const extension = path.extname(
      file.originalname
    ).toLowerCase();

    const uniqueName =
      file.fieldname +
      "-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1E9) +
      extension;

    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      "Only JPEG, PNG and WebP images are allowed"
    );

    error.statusCode = 400;
    cb(error);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post(
  "/addDoctors",
  auth("admin"),
  upload.single("image"),
  addDoctor
);

router.get(
  "/allDoctors",
  getAllDoctors
);

router.get(
  "/search",
  searchDoctors
);

router.get(
  "/count",
  getDoctorsCount
);

router.get(
  "/byDepartment/:departmentId",
  getDoctorsByDepartment
);

router.put(
  "/:id",
  auth("admin"),
  upload.single("image"),
  updateDoctor
);

router.delete(
  "/:id",
  auth("admin"),
  deleteDoctor
);

router.get(
  "/:id",
  getDoctorById
);

export default router;