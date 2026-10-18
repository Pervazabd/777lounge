export function errorHandler(error, _request, response, _next) {
  if (error.type === "entity.parse.failed") {
    return response.status(400).json({
      success: false,
      message: "Request body must contain valid JSON.",
    });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return response.status(400).json({
      success: false,
      message: "Reservation details are invalid.",
    });
  }

  if (error.status === 429) {
    return response.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  }

  console.error("Unhandled API error:", error);
  return response.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
}
