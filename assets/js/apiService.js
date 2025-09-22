// --- Configuration Constants ---
const BASE_URL = 'https://www.bankconfigurationportal.com';
const BANK_NAME = 'Arab Bank';
const BANK_NAME_AR = 'البنك العربي';
const BRANCH_ID = '66';
const USERNAME = 'arabbankuser';
const PASSWORD = 'asdasdasd';

/**
 * Authenticates with the API and stores the tokens in localStorage.
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
    localStorage.setItem('accessToken', tokenData.access_token);
    localStorage.setItem('refreshToken', tokenData.refresh_token);

    console.log('Authentication successful.');
}

/**
 * Refreshes the access token using the refresh token.
 */
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token available for refresh.');
    }

    try {
        const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: refreshToken })
        });

        if (!response.ok) throw new Error('Token refresh failed.');

        const tokenData = await response.json();
        localStorage.setItem('accessToken', tokenData.access_token);
        console.log('Access token refreshed successfully.');

    } catch (error) {
        console.error('Token refresh failed. Clearing tokens and forcing re-authentication.', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        await authenticate(); 
    }
}

/**
 * A wrapper for fetch that handles authentication and token refreshing.
 * @param {string} url The URL to fetch.
 * @returns {Promise<Response>} The fetch response.
 */
async function fetchWithAuth(url) {
    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 401) {
        console.log('Access token expired or invalid. Refreshing...');
        await refreshAccessToken();

        // Retry the original request with the new token
        response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json'
            }
        });
    }

    return response;
}

/**
 * Fetches the screen design data from the API.
 * @returns The screen data.
 */
export async function fetchScreenData() {
    const response = await fetchWithAuth(`${BASE_URL}/api/screen-design?branchId=${BRANCH_ID}&onlyAllocated=true`);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch screen design: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

/**
 * Initializes the API service by authenticating if no valid token exists.
 */
export async function initializeApiService() {
    const token = localStorage.getItem('accessToken');

    // Authenticate only if there's no token.
    if (!token) {
        console.log('No token found in storage. Authenticating...');
        await authenticate();
    } else {
        console.log('Token found in storage. Skipping authentication.');
    }
}

// Export constants for the UI module to use
export { BANK_NAME, BANK_NAME_AR };


