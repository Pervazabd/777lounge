export function errorHandler(error, _request, response, _next) {
  if (error.type === "entity.parse.failed") {
    return response.status(400).json({
      success: false,
      message: "İstek gövdesi geçerli JSON içermelidir.",
    });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return response.status(400).json({
      success: false,
      message: "Girilen bilgiler geçersiz.",
    });
  }

  if (error.code === 11000) {
    return response.status(409).json({
      success: false,
      message: "Bu kategori ve adla kayıtlı bir ürün zaten var.",
    });
  }

  if (error.status === 429) {
    return response.status(429).json({
      success: false,
      message: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",
    });
  }

  console.error("Unhandled API error:", error);
  return response.status(500).json({
    success: false,
    message: "Beklenmeyen bir sunucu hatası oluştu.",
  });
}
