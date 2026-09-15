import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createError(
        "Name, email and password are required",
        400
      );
    }

    if (typeof name !== "string" || !name.trim()) {
      throw createError(
        "Name must be valid text",
        400
      );
    }

    if (typeof email !== "string" || !email.trim()) {
      throw createError(
        "Email must be valid text",
        400
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw createError(
        "Invalid email format",
        400
      );
    }

    if (
      typeof password !== "string" ||
      password.length < 6
    ) {
      throw createError(
        "Password must be at least 6 characters",
        400
      );
    }

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      throw createError(
        "Email already registered",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user"
    });

    try {
      await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw createError(
          "Email already registered",
          400
        );
      }

      throw error;
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token
    });
  } catch (error) {
    next(error);
  }
};

export const signinUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError(
        "Email and password are required",
        400
      );
    }

    if (typeof email !== "string" || !email.trim()) {
      throw createError(
        "Email must be valid text",
        400
      );
    }

    if (typeof password !== "string") {
      throw createError(
        "Password must be valid text",
        400
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw createError(
        "Invalid email format",
        400
      );
    }

    const user = await User.findOne({
      email: normalizedEmail
    }).select("+password");

    if (!user) {
      throw createError(
        "Invalid email or password",
        401
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw createError(
        "Invalid email or password",
        401
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    next(error);
  }
};