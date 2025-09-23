// --- DOM Elements ---
const loaderOverlay = document.getElementById('loader-overlay');
const bankNameElement = document.getElementById('bank-name');
const branchNameElement = document.getElementById('branch-name');
const buttonsContainer = document.getElementById('button-container');
const dateTimeElement = document.getElementById('datetime');
const langEnBtn = document.getElementById('lang-en');
const langArBtn = document.getElementById('lang-ar');
const mainContent = document.getElementById('main-content');
const langSwitcherRow = document.querySelector('.lang-switcher-row'); 
const messageContainer = document.getElementById('message-container');
const messageText = document.getElementById('message-text');
const backBtn = document.getElementById('back-btn');
let currentMessageData = null; // Store both languages

const localizedStrings = {
    en: {
        connection: 'Cannot connect to the server. It may be offline or there is a network issue. Please Contact support.',
        ticket: 'A ticket has been issued for '
    },
    ar: {
        connection: 'لا يمكن الاتصال بالخادم. قد يكون غير متصل أو هناك مشكلة في الشبكة. يرجى الاتصال بالدعم.',
        ticket: 'تم إصدار تذكرة ل'
    }
};



/**
 * Centralized error handler. Logs to console with a timestamp and shows a user-friendly message.
 * @param {string} userMessage - The message to show to the user in the modal.
 * @param {Error} error - The actual error object for console logging.
 * @param {boolean} isCritical - If true, it will replace the body content.
 * @param {string} lang - The current language ('en' or 'ar').
 */
export function handleError(userMessage, error, isCritical = false, lang = 'en', onBack = null) {
    // Special handling for network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
        userMessage = localizedStrings[lang].connection;
    }
    // Log detailed error to the console
    console.error(`[${new Date().toLocaleString()}]\n${userMessage}\n`, error);

    // Show appropriate message to the user
    if (isCritical) {
        hideLoader(); // Ensure loader is hidden
        const errorTitle = lang === 'ar' ? 'خطأ في التطبيق' : 'Application Error';
        document.body.innerHTML = `<div class="error-container">
                                    <h2>${errorTitle}</h2>
                                    <p class="error-text">${userMessage}</p>
                                </div>`;
    } else {
        //show message screen with back button that rerenders the main screen
        showMessageScreen(userMessage, lang, onBack || (() => {}));
    }
}

export function hideLoader() {
    if (loaderOverlay) {
        loaderOverlay.style.opacity = '0';
        setTimeout(() => {
            loaderOverlay.style.display = 'none';
        }, 500); // Must match the transition duration in CSS
    }
}


/**
 * Handles the logic for a button click.
 * @param {Object} button The button data object from the API.
 * @param {string} lang The current language ('en' or 'ar').
 */
function handleButtonClick(button, lang, onBack) {
    if (button.buttonType === 'ShowMessage') {
        currentMessageData = {
            en: button.messageEnglish,
            ar: button.messageArabic
        };
        showMessageScreen(lang === 'ar' ? button.messageArabic : button.messageEnglish, lang, onBack);
    } else if (button.buttonType === 'IssueTicket') {
        currentMessageData = {
            en: `${localizedStrings.en.ticket}${button.serviceNameEnglish}`,
            ar: `${localizedStrings.ar.ticket}${button.serviceNameArabic}`
        };
        showMessageScreen(lang === 'ar' ? currentMessageData.ar : currentMessageData.en, lang, onBack);
    }
}


/**
 * Renders the entire screen based on data from the API.
 * @param {Object} screenData The screen data object.
 * @param {Object} names - Object containing bank and branch names in both languages.
 * @param {string} lang - The current language ('en' or 'ar').
 */
export function renderScreen(screenData, names, lang) {
    bankNameElement.innerText = lang === 'ar' ? names.bankNameArabic : names.bankNameEnglish;
    branchNameElement.innerText = lang === 'ar' ? screenData.branchNameArabic : screenData.branchNameEnglish;
    buttonsContainer.innerHTML = '';

    // Limit to first 15 buttons
    const buttonsToRender = screenData.buttons.slice(0, 15);

    buttonsToRender.forEach(button => {
        const buttonName = lang === 'ar' ? button.nameArabic : button.nameEnglish;
        const buttonElement = document.createElement('button');
        buttonElement.innerText = buttonName;
        buttonElement.addEventListener('click', () =>
            handleButtonClick(button, lang, (currentLang) => renderScreen(screenData, names, currentLang || lang))
        );
        buttonsContainer.appendChild(buttonElement);
    });
}

/**
 * Updates the date and time display based on language.
 * @param {string} lang The current language ('en' or 'ar').
 */
export function updateDateTime(lang) {
    const locale = lang === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-US';
    dateTimeElement.innerText = new Date().toLocaleString(locale);
}

/**
 * Sets up all UI-related event listeners.
 * @param {function} onLanguageChange - Callback function to execute when language changes.
 */
export function initializeUIEventListeners(onLanguageChange) {
    langEnBtn.addEventListener('click', () => {
        onLanguageChange('en');
        langEnBtn.classList.add('active');
        langArBtn.classList.remove('active');
    });

    langArBtn.addEventListener('click', () => {
        onLanguageChange('ar');
        langArBtn.classList.add('active');
        langEnBtn.classList.remove('active');
    });
}

/**
 * Shows a message screen and hides the button container.
 * @param {string} message - The message to display.
 * @param {string} lang - The current language ('en' or 'ar').
 * @param {function} onBack - Callback to restore the main screen.
 */
export function showMessageScreen(message, lang, onBack) {
    // Hide buttons, show message
    buttonsContainer.style.display = 'none';
    mainContent.style.justifyContent = 'center';
    messageContainer.classList.remove('hidden');
    
    // Set content
    messageText.textContent = message;

    // Remove old listeners by cloning
    backBtn.replaceWith(backBtn.cloneNode(true));
    const newBackBtn = document.getElementById('back-btn');
    
    newBackBtn.textContent = lang === 'ar' ? 'العودة' : 'Back';

    newBackBtn.addEventListener('click', () => {
        // Hide message, show buttons
        messageContainer.classList.add('hidden');
        buttonsContainer.style.display = 'grid';
        mainContent.style.justifyContent = 'normal'; 
        
        const currentLang = document.documentElement.lang; 
        
        if (onBack) onBack(currentLang);
    });
}

export function updateMessageLanguage(lang) {
    if (!currentMessageData) return;
    
    // Update message text
    messageText.textContent = lang === 'ar' ? currentMessageData.ar : currentMessageData.en;
    
    // Update back button text
    document.getElementById('back-btn').textContent = lang === 'ar' ? 'العودة' : 'Back';
}