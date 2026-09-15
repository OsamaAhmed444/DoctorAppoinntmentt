import express from "express";
import multer from "multer";
import path from "path";
import auth from "../auth/Middleware.js";

import {
  addDepartment,
  getAllDepartments,
  getDepartmentsCount,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController.js";

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
  "/addDepartments",
  auth("admin"),
  upload.single("image"),
  addDepartment
);

router.get(
  "/allDepartments",
  getAllDepartments
);

router.get(
  "/count",
  getDepartmentsCount
);

router.put(
  "/:id",
  auth("admin"),
  upload.single("image"),
  updateDepartment
);

router.delete(
  "/:id",
  auth("admin"),
  deleteDepartment
);

export default router;