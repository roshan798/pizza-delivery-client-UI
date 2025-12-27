import CONFIG from "@/config";
import { cookies } from "next/headers";

export async function getSession() {
    return await getSelf();
}

async function getSelf() {
    // Implementation to get the current user session
    const clientCookies = await cookies()
    const accessToken = clientCookies.get("accessToken")?.value;
    const res = await fetch(CONFIG.baseUrl + CONFIG.auth.self, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        credentials: "include",
    });
    if (!res.ok) {
        return null;
    }
    const data = await res.json();
    return data;

}