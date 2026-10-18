const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function submitReservation(reservation) {
    const response = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Could not submit reservation.");
    }

    return result.data;
}
