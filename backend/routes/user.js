import express from "express";

import {
  registerUser,
  signinUser
} from "../controllers/userController.js";

const router = express.Router();


// =====================================================
// Authentication Routes
// =====================================================

// Register
router.post(
  "/register",
  registerUser
);


// Sign In
router.post(
  "/signin",
  signinUser
);


export default router;