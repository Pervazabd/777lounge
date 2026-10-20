import { API_BASE_URL } from "./apiBase.js";

export async function getMenuItems(signal) {
    const response = await fetch(`${API_BASE_URL}/api/products`, { signal });
    const result = await response.json();

    if (!response.ok || !result.success || !Array.isArray(result.data?.items)) {
        throw new Error(result.message || "Could not load menu products.");
    }

    return result.data.items;
}
