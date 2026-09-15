import jwt from "jsonwebtoken";

const auth = (requiredRole = null) => {
  return (req, res, next) => {
    try {
      const authorization =
        req.headers.authorization;

      if (!authorization) {
        const error = new Error(
          "Access denied. No token provided."
        );

        error.statusCode = 401;
        throw error;
      }

      const parts = authorization.split(" ");

      if (
        parts.length !== 2 ||
        parts[0] !== "Bearer" ||
        !parts[1]
      ) {
        const error = new Error(
          "Invalid authorization format. Use Bearer <token>."
        );

        error.statusCode = 401;
        throw error;
      }

      const token = parts[1];

      jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            const error = new Error(
              "Invalid or expired token."
            );

            error.statusCode = 401;
            return next(error);
          }

          if (
            !decoded.id ||
            !decoded.role
          ) {
            const error = new Error(
              "Invalid token payload."
            );

            error.statusCode = 401;
            return next(error);
          }

          if (
            requiredRole &&
            decoded.role !== requiredRole
          ) {
            const error = new Error(
              "Access denied. Insufficient permissions."
            );

            error.statusCode = 403;
            return next(error);
          }

          req.user = decoded;

          next();
        }
      );
    } catch (error) {
      next(error);
    }
  };
};

export default auth;