import { timingSafeEqual } from "node:crypto";

export function requireAdminKey(request, response, next) {
  const configuredKey = process.env.ADMIN_API_KEY;
  if (!configuredKey) {
    return response.status(503).json({
      success: false,
      message: "Sunucuda yönetici erişimi yapılandırılmamış.",
    });
  }

  const providedKey = request.get("x-admin-key") || "";
  const providedBuffer = Buffer.from(providedKey);
  const configuredBuffer = Buffer.from(configuredKey);
  const isValid = providedBuffer.length === configuredBuffer.length
    && timingSafeEqual(providedBuffer, configuredBuffer);

  if (!isValid) {
    return response.status(401).json({
      success: false,
      message: "Geçerli bir yönetici anahtarı gerekli.",
    });
  }

  return next();
}
