'use server'

import CONFIG from "@/config";
import { mapServerFormErrors } from "@/lib/utils";
import { cookies } from 'next/headers';
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

/**
 * Parses raw 'Set-Cookie' header string(s) and returns an array of parsed cookie objects.
 * @param rawCookies The raw 'Set-Cookie' header string, which might contain multiple directives.
 * @returns An array of parsed cookie objects.
 */
function parseCookies(rawCookies: string): setCookie.Cookie[] {
    if (!rawCookies) {
        return [];
    }
    const cookieHeaderArray = setCookie.splitCookiesString(rawCookies);
    return setCookie.parse(cookieHeaderArray);
}

/**
 * Parses the 'Set-Cookie' header and sets the cookies in the Next.js environment.
 * @param setCookieHeader The raw 'Set-Cookie' header string.
 * @param actionName The name of the action (e.g., 'login', 'signup') for logging purposes.
 * @param excludeCookies An optional array of cookie names to exclude from being set.
 */

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
    return { success: true, message: 'Login successful!' };
}


//
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

        return { success: false, message: 'Signup failed.',errors };
    }
    const setCookieHeader = res.headers.get('set-cookie');

    await setAuthCookies(setCookieHeader, 'signup');
    return { success: true, message: 'Signup successful!' };
}