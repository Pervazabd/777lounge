const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function adminRequest(path, adminKey, options = {}) {
    let response;
    try {
        response = await fetch(`${API_BASE_URL}/api/products/admin${path}`, {
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

export async function getAdminMenuItems(adminKey) {
    const data = await adminRequest("", adminKey);
    return data.items;
}

export async function saveMenuItem(adminKey, item) {
    const isExistingItem = Boolean(item._id);
    const data = await adminRequest(isExistingItem ? `/${item._id}` : "", adminKey, {
        method: isExistingItem ? "PUT" : "POST",
        body: JSON.stringify(item),
    });
    return data.item;
}

export async function removeMenuItem(adminKey, itemId) {
    await adminRequest(`/${itemId}`, adminKey, { method: "DELETE" });
}
