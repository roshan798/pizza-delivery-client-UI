import CONFIG from "@/config";
import { cookies } from "next/headers";

export async function getSession() {
    return await getSelf(); //
}
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'customer';
    createdAt: string; // ISO 8601 date string
    updatedAt: string; // ISO 8601 date string
}

interface SessionResponse {
    success: boolean;
    user: User;
}



async function getSelf(): Promise<SessionResponse | null> {
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
    const data: SessionResponse = await res.json();
    return data;

}