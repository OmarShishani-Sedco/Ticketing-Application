import { initializeApiService, fetchScreenData, BANK_NAME, BANK_NAME_AR } from './apiService.js';
import { renderScreen, updateDateTime, initializeUIEventListeners, hideLoader, handleError } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    let currentLanguage = 'en'; // Default language
    let currentScreenData = null; // Cache screen data

    const names = {
        bankNameEnglish: BANK_NAME,
        bankNameArabic: BANK_NAME_AR,
    };

    /**
     * Re-renders the UI with the current data and language.
     */
    function refreshUI() {
        if (currentScreenData) {
            renderScreen(currentScreenData, names, currentLanguage);
        }
        updateDateTime(currentLanguage);
    }

    /**
     * Handles language change, updates UI direction, and re-renders.
     * @param {string} newLang The new language to switch to.
     */
    function onLanguageChange(newLang) {
        if (newLang === currentLanguage) return;
        currentLanguage = newLang;
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        refreshUI();
    }

    /**
     * Main function to initialize the application.
     */
    async function initializeApp() {
        try {
            // Set up basic UI elements
            initializeUIEventListeners(onLanguageChange);
            updateDateTime(currentLanguage);
            setInterval(() => updateDateTime(currentLanguage), 1000);

            // Authenticate and get initial screen data
            await initializeApiService();
            
            // Load initial screen data
            try {
                currentScreenData = await fetchScreenData();
                renderScreen(currentScreenData, names, currentLanguage);
            } catch (error) {

                handleError('Could not load screen data. Please check the connection.', error, true, currentLanguage);
            }

            hideLoader();


        } catch (error) {
            // Critical, blocking errors
            handleError('Application failed to start. Please contact support.', error, true, currentLanguage);
        }
    }

    // Start the application
    initializeApp();
});