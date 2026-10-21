import { API_BASE_URL } from "./apiBase.js";

async function reservationAdminRequest(path, adminKey, options = {}) {
    let response;
    try {
        response = await fetch(`${API_BASE_URL}/api/reservations/admin${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "X-Admin-Key": adminKey,
                ...options.headers,
            },
        });
    } catch {
        throw new Error("Sunucuya bağlanılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
    }

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error("Sunucudan geçersiz bir yanıt alındı.");
    }
    if (!response.ok || !result.success) {
        throw new Error(result.message || "Yönetim isteği başarısız oldu.");
    }

    return result.data;
}

export async function getAdminReservations(adminKey) {
    const data = await reservationAdminRequest("", adminKey);
    return data.reservations;
}

export async function cancelAdminReservation(adminKey, reservationId) {
    const data = await reservationAdminRequest(`/${reservationId}/cancel`, adminKey, {
        method: "PATCH",
    });
    return data.reservation;
}

export async function deleteAdminReservation(adminKey, reservationId) {
    const data = await reservationAdminRequest(`/${reservationId}`, adminKey, {
        method: "DELETE",
    });
    return data.id;
}

export async function deleteAllAdminReservations(adminKey) {
    const data = await reservationAdminRequest("/all", adminKey, {
        method: "DELETE",
    });
    return data.deletedCount;
}
