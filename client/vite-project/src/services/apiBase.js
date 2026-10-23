const configuredApiUrl = (import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/\/+$/, "");
const productionApiUrl = "https://seven77lounge-8.onrender.com";

function isLocalApiUrl(apiUrl) {
    try {
        const hostname = new URL(apiUrl).hostname.toLowerCase();
        return hostname === "localhost"
            || hostname.endsWith(".localhost")
            || hostname === "127.0.0.1"
            || hostname.startsWith("127.")
            || hostname === "[::1]"
            || hostname === "::1"
            || hostname === "0.0.0.0";
    } catch {
        return false;
    }
}

export const API_BASE_URL = import.meta.env.PROD
    ? configuredApiUrl && !isLocalApiUrl(configuredApiUrl)
        ? configuredApiUrl
        : productionApiUrl
    : configuredApiUrl;
