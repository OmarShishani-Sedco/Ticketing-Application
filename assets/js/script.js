import { initializeApiService, fetchScreenData, BANK_NAME, BRANCH_NAME } from './apiService.js';
import { renderScreen, updateDateTime, initializeUIEventListeners, hideLoader, handleError } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const API_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

    /**
     * Main function to initialize the application.
     */
    async function initializeApp() {
        try {
            // Set up basic UI elements 
            initializeUIEventListeners();
            updateDateTime();
            setInterval(updateDateTime, 1000);

            // Authenticate and get initial screen data
            await initializeApiService();
            const screenData = await fetchScreenData();
            renderScreen(screenData, BANK_NAME, BRANCH_NAME);

            hideLoader();

            // Set up a periodic refresh of the screen data
            setInterval(async () => {
                try {
                    const updatedScreenData = await fetchScreenData();
                    renderScreen(updatedScreenData, BANK_NAME, BRANCH_NAME);
                } catch (error) {
                    //  Non-critical errors
                    handleError('Could not refresh screen data. Please check the connection.', error);
                }
            }, API_REFRESH_INTERVAL);

        } catch (error) {
            // Critical, blocking errors
            handleError('Application failed to start. Please contact support.', error, true);
        }
    }

    // Start the application
    initializeApp();
});