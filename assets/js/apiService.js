// --- Configuration Constants ---
const BASE_URL = 'https://www.bankconfigurationportal.com';
const BANK_NAME = 'Arab Bank';
const BRANCH_ID = '66';
const BRANCH_NAME = 'Main Branch';
const USERNAME = 'arabbankuser';
const PASSWORD = 'asdasdasd';
const TOKEN_REFRESH_LEEWAY = 60 * 1000; // 1 minute

// --- State Management ---
let currentAccessToken = null;
let currentRefreshToken = null;
let tokenExpiryTime = null;

/**
 * Authenticates with the API and stores the tokens.
 */
async function authenticate() {
    const response = await fetch(`${BASE_URL}/api/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: USERNAME, password: PASSWORD, bankName: BANK_NAME })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${response.status} - ${errorText}`);
    }

    const tokenData = await response.json();
    currentAccessToken = tokenData.access_token;
    currentRefreshToken = tokenData.refresh_token;
    tokenExpiryTime = Date.now() + (tokenData.expires_in * 60 * 1000);
    console.log('Authentication successful.');
}

/**
 * Refreshes the access token using the refresh token.
 */
async function refreshAccessToken() {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: currentRefreshToken })
        });

        if (!response.ok) throw new Error('Token refresh failed.');

        const tokenData = await response.json();
        currentAccessToken = tokenData.access_token;
        tokenExpiryTime = Date.now() + (tokenData.expires_in * 60 * 1000);
        console.log('Access token refreshed successfully.');
    } catch (error) {
        console.error('Token refresh failed. Attempting full re-authentication.', error);
        await authenticate(); // Re-authenticate if refresh fails
    }
}

/**
 * Fetches the screen design data from the API.
 * @returns The screen data.
 */
export async function fetchScreenData() {
    if (!currentAccessToken || Date.now() > tokenExpiryTime - TOKEN_REFRESH_LEEWAY) {
        console.log('Token is invalid, expired, or nearing expiry. Refreshing...');
        await refreshAccessToken();
    }

    const response = await fetch(`${BASE_URL}/api/screen-design?branchId=${BRANCH_ID}&onlyAllocated=true`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${currentAccessToken}` }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch screen design: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

/**
 * Initializes the API service by authenticating.
 */
export async function initializeApiService() {
    await authenticate();
}

// Export constants for the UI module to use
export { BANK_NAME, BRANCH_NAME };