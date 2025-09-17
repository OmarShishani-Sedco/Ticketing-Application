// --- DOM Elements ---
const loaderOverlay = document.getElementById('loader-overlay');
const bankNameElement = document.getElementById('bank-name');
const branchNameElement = document.getElementById('branch-name');
const buttonsContainer = document.getElementById('button-container');
const dateTimeElement = document.getElementById('datetime');
const modal = document.getElementById('message-modal');
const modalText = document.getElementById('modal-text');
const closeButton = document.querySelector('.close-button');

/**
 * Centralized error handler. Logs to console with a timestamp and shows a user-friendly message.
 * @param {string} userMessage - The message to show to the user in the modal.
 * @param {Error} error - The actual error object for console logging.
 * @param {boolean} isCritical - If true, it will replace the body content.
 */
export function handleError(userMessage, error, isCritical = false) {

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
        userMessage = 'Cannot connect to the server. It may be offline or there is a network issue. Please Contact support.';
    }
    // Log detailed error to the console
    console.error(`[${new Date().toLocaleString()}]\n${userMessage}\n`, error);

    // Show appropriate message to the user
    if (isCritical) {
        hideLoader(); // Ensure loader is hidden
        document.body.innerHTML = `<div class="error-container">
                                    <h2>Application Error</h2>
                                    <p class="error-text">${userMessage}</p>
                                </div>`;
    } else {
        showMessage(userMessage);
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


function closeModal() {
    modal.classList.add('fade-out');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

/**
 * Displays a message in the modal.
 * @param {string} message The message to display.
 */
function showMessage(message) {
    modalText.innerText = message;
    modal.classList.remove('hidden', 'fade-out');
}

/**
 * Handles the logic for a button click.
 * @param {Object} button The button data object from the API.
 */
function handleButtonClick(button) {
    if (button.buttonType === 'ShowMessage') {
        showMessage(button.messageEnglish);
    } else if (button.buttonType === 'IssueTicket') {
        showMessage(`A ticket has been issued for ${button.serviceName}`);
    }
}

/**
 * Renders the entire screen based on data from the API.
 * @param {Object} screenData The screen data object.
 * @param {string} bankName The name of the bank.
 * @param {string} branchName The name of the branch.
 */
export function renderScreen(screenData, bankName, branchName) {
    bankNameElement.innerText = bankName;
    branchNameElement.innerText = branchName;
    buttonsContainer.innerHTML = '';

    // Limit to first 15 buttons
    const buttonsToRender = screenData.buttons.slice(0, 15);

    buttonsToRender.forEach(button => {
        const buttonElement = document.createElement('button');
        buttonElement.innerText = button.nameEnglish;
        buttonElement.addEventListener('click', () => handleButtonClick(button));
        buttonsContainer.appendChild(buttonElement);
    });
}

export function updateDateTime() {
    dateTimeElement.innerText = new Date().toLocaleString();
}

export function initializeUIEventListeners() {
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
}