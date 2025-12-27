'use server'

import CONFIG from "@/config";
import { mapServerFormErrors } from "@/lib/utils";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import setCookie from 'set-cookie-parser';
// Define the state interface for login actions
export interface LoginState {
    message: string;
    success: boolean;
    errors?: Record<string, string>;
}

export interface SignUpState {
    message: string;
    success: boolean;
    errors?: Record<string, string>;
}
export interface LogoutState {
    message: string;
    success: boolean;
    errors?: Record<string, string>;
}

function parseCookies(rawCookies: string): setCookie.Cookie[] {
    if (!rawCookies) {
        return [];
    }
    const cookieHeaderArray = setCookie.splitCookiesString(rawCookies);
    return setCookie.parse(cookieHeaderArray);
}

async function setAuthCookies(setCookieHeader: string | null, actionName: string, excludeCookies: string[] = []): Promise<void> {
    if (setCookieHeader) {
        const parsedCookies = parseCookies(setCookieHeader);
        console.log(`Parsed Cookies for ${actionName}:`, parsedCookies);
        const store = await cookies();
        parsedCookies.forEach(cookie => {
            if (excludeCookies.includes(cookie.name)) {
                return; // Skip setting this cookie
            }
            store.set(cookie.name, cookie.value, {
                maxAge: cookie.maxAge,
                domain: cookie.domain,
                path: cookie.path,
                expires: cookie.expires,
                httpOnly: cookie.httpOnly,
                sameSite: cookie.sameSite as 'lax' | 'strict' | 'none' | undefined,
            });
        });
    } else {
        console.warn(`No Set-Cookie header found in the ${actionName} response.`);
    }
}

export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const email = formData.get('email');
    const password = formData.get('password');
    const loginReqBody = { email, password };
    const res = await fetch(CONFIG.baseUrl + CONFIG.auth.login, {
        method: 'POST',
        body: JSON.stringify(loginReqBody),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await res.json(); // Consume the response body once

    if (!res.ok) {
        const errors = mapServerFormErrors(data);
        return { success: false, message: errors['general'] || 'Login failed. Please check your credentials.', errors };
    }
    const setCookieHeader = res.headers.get('set-cookie'); // Get cookies from headers

    await setAuthCookies(setCookieHeader, 'login');
    redirect('/');
}


export async function createUser(prevState: SignUpState, formData: FormData): Promise<SignUpState> {
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const signupReqBody = { firstName, lastName, email, password };
    console.log('Signup request body:', signupReqBody);
    const res = await fetch(CONFIG.baseUrl + CONFIG.auth.signup, {
        method: 'POST',
        body: JSON.stringify(signupReqBody),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await res.json();

    if (!res.ok) {
        const errors = mapServerFormErrors(data);

        return { success: false, message: 'Signup failed.', errors };
    }
    const setCookieHeader = res.headers.get('set-cookie');

    await setAuthCookies(setCookieHeader, 'signup');
    redirect('/');
}

export async function logoutUser(): Promise<LogoutState> {
    const clientCookies = await cookies();
    const accessToken = clientCookies.get("accessToken")?.value;
    const refreshToken = clientCookies.get("refreshToken")?.value;

    const store = await cookies();
    store.delete('accessToken');
    store.delete('refreshToken');

    try {
        const res = await fetch(CONFIG.baseUrl + CONFIG.auth.logout, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken ? `Bearer ${accessToken}` : '',
                'cookie' : refreshToken ? `refreshToken=${refreshToken}` : '',
            },
        });

        if (!res.ok) {
            const data = await res.json();
            console.error('Server-side logout failed:', data);
            return { success: false, message: data.message || 'Logout failed on the server.' };
        }

        redirect('/');
    } catch (error) {
        console.error('Network or unexpected error during logout:', error);
        return { success: false, message: 'An unexpected error occurred during logout.' };
    }
}