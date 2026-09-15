const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message)

  const statusCode = err.statusCode || 500

  const message =
    statusCode >= 500
      ? "Internal Server Error"
      : err.message || "Request failed"

  return res.status(statusCode).json({
    message
  })
}

export default errorHandler