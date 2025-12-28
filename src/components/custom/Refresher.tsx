'use client'

import { Fragment, useCallback, useEffect, useState, useRef } from "react"
import * as jose from 'jose'

const REFRESH_BUFFER_MS = 5 * 1000; // 5 Seconds in milliseconds
const POLLING_INTERVAL_MS = 10 * 1000; // 10 Seconds in milliseconds

const Refresher = (
    { children }: { children: React.ReactNode }
) => {
    console.log('Refresher component rendered')
    const [currentAccessToken, setCurrentAccessToken] = useState<string | null>(null);
    const refreshTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const pollTokenIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const getTokens = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/token');
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched access token data:', data);
                return data;
            }
            // If response is not OK, log the status and return null
            console.warn(`Failed to fetch access token: ${res.status} ${res.statusText}`);
            return null;
        } catch (error) {
            // Catch any network errors or other exceptions during fetch
            console.error('Error fetching access token:', error);
            return null;
        }
    }, []);


    const refreshToken = useCallback(async () => {
        console.log('Attempting to refresh access token...');
        try {
            // 'credentials: include' ensures cookies (like the refresh token) are sent with the request
            const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
            if (res.ok) {
                console.log('Access token refresh successful.');
                // After successful refresh, immediately try to get the new access token
                // This will update currentAccessToken and re-trigger the useEffect
                const newTokens = await getTokens(); // Fetch the new token after refresh
                if (newTokens.accessToken !== currentAccessToken) {
                    setCurrentAccessToken(newTokens.accessToken);
                } else {
                    console.log('refreshToken: New token is identical to current state. No state update needed.');
                }
            } else {
                console.warn(`Failed to refresh access token: ${res.status} ${res.statusText}`);
                // If refresh fails, it might mean the refresh token is invalid/expired,
                // so clear the current access token state.
                if (currentAccessToken !== null) { // Only clear if it's not already null
                    setCurrentAccessToken(null);
                }
            }
        } catch (error) {
            console.error('Error refreshing access token:', error);
            if (currentAccessToken !== null) { // Only clear if it's not already null
                setCurrentAccessToken(null);
            }
        }
    }, [getTokens, currentAccessToken, setCurrentAccessToken]); // Dependencies: currentAccessToken added here

    useEffect(() => {
        console.log('useEffect: Setting up token refresher logic...');

        if (pollTokenIntervalRef.current) {
            clearInterval(pollTokenIntervalRef.current);
            pollTokenIntervalRef.current = undefined;
            console.log('useEffect: Cleared existing token polling interval.');
        }

        const setupTokenRefresh = async () => {
            console.log('useEffect: Attempting to fetch and set up token refresh...');
            const tokens = await getTokens(); // Fetch the latest token

            if (tokens.accessToken) {
                const token = tokens.accessToken;
                try {
                    const decodedToken = jose.decodeJwt(token);
                    console.log('useEffect: Decoded Token:', decodedToken);

                    if (token !== currentAccessToken) { // Only update if the token value has actually changed
                        setCurrentAccessToken(token);
                    } else {
                        console.log('useEffect: Fetched token is identical to current state. No state update needed.');
                    }

                    const expiryTimeMs = decodedToken.exp ? decodedToken.exp * 1000 : null;

                    if (expiryTimeMs) {
                        const currentTimeMs = Date.now();
                        const timeLeftMs = expiryTimeMs - currentTimeMs;
                        console.log(`useEffect: Token expires in ${timeLeftMs / 1000} seconds.`);

                        // Calculate when to refresh: expiry time minus a buffer.
                        // Ensure the refresh time is not in the past.
                        const refreshInMs = Math.max(0, timeLeftMs - REFRESH_BUFFER_MS);

                        console.log(`useEffect: Scheduling token refresh in ${refreshInMs / 1000} seconds.`);

                        // Set a timeout to call refreshToken before the token expires
                        refreshTimeoutRef.current = setTimeout(async () => {
                            console.log('useEffect: Triggering token refresh via setTimeout...');
                            await refreshToken(); // This will fetch a new token and update currentAccessToken
                        }, refreshInMs);

                    } else {
                        console.warn('useEffect: Token has no expiry time (exp claim). Cannot schedule automatic refresh.');
                        // If no expiry, we might still want to set the token, but no auto-refresh
                        if (token !== currentAccessToken) { // Only update if the token value has actually changed
                            setCurrentAccessToken(token);
                        }
                    }
                } catch (error) {
                    console.error('useEffect: Error decoding token or setting up refresh:', error);
                    if (currentAccessToken !== null) { // Only clear if it's not already null
                        setCurrentAccessToken(null); // Invalidate token if decoding fails
                    }
                }
            }
            else if (tokens.refreshToken) {
                console.log('useEffect: Refresh Token exists but no Access Token. Will attempt to refresh soon.');
                // If only refresh token exists, we can try to refresh immediately
                await refreshToken();
            }
            else {
                console.log('useEffect: No Access Token found. Clearing currentAccessToken state.');
                // Ensure currentAccessToken is null if no token is found
                if (currentAccessToken !== null) { // Only clear if it's not already null
                    setCurrentAccessToken(null); // Ensure state is null if no token is found
                }

                // If no token is found, start polling to check for a token periodically.
                // This handles cases where login happens without a full page reload and Refresher doesn't re-render
                if (!pollTokenIntervalRef.current) { // Only start polling if not already active
                    console.log('useEffect: Starting token polling interval (every 5 seconds) to detect login...');
                    pollTokenIntervalRef.current = setInterval(() => {
                        console.log('useEffect: Polling for token...');
                        setupTokenRefresh(); // Re-run setup to check for token
                    }, POLLING_INTERVAL_MS); // Check every 5 seconds
                }
            }
        }
        setupTokenRefresh();
        // Cleanup function for useEffect
        return () => {
            console.log('useEffect: Cleaning up previous token refresh timeout.');
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
                refreshTimeoutRef.current = undefined;
            }
            if (pollTokenIntervalRef.current) {
                clearInterval(pollTokenIntervalRef.current);
                pollTokenIntervalRef.current = undefined;
            }
        };
    }, [getTokens, currentAccessToken, refreshToken, setCurrentAccessToken]); // Dependencies: setCurrentAccessToken added for completeness, though often stable.
    // - getAccessToken: If this function reference ever changed (unlikely with useCallback([])), re-run.
    // - currentAccessToken: Crucial for re-running when the token state changes (e.g., after login/refresh).
    // - refreshToken: Included because it's a stable function reference now due to useCallback.

    return (
        <Fragment>{children}</Fragment>
    )
}

export default Refresher