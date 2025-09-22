# Ticketing Application

## Overview
The Bank Ticketing Application is a modern, responsive web application designed for bank branches to manage customer service queues efficiently. It provides a clean, user-friendly interface for customers to select services and receive tickets, with a focus on reliability and user experience.

## Features
- **Dynamic UI Rendering**: Buttons and screen information are rendered dynamically based on data fetched from a backend API.
- **Asynchronous API Communication**: Handles authentication, token refreshing, and data fetching without blocking the UI.
- **Modern User Feedback**: Includes a loading spinner during initial startup and a dedicated message screen for user messages and ticket confirmations.
- **Robust Error Handling**:
    - Displays user-friendly messages for both critical startup failures and non-critical API errors.
    - Logs all JavaScript errors with timestamps to the browser console for easier debugging.
    - If a critical error occurs (such as failure to load initial data), the application displays a blocking error screen.
- **Responsive Design**: The layout adapts seamlessly to various screen sizes, from large kiosk displays to tablets and mobile devices.
- **Live Language Switching**: Supports both English and Arabic, with proper font handling and directionality.
- **Secure by Default**: Includes a `web.config` for IIS deployments with security headers (CSP, HSTS, X-Frame-Options) to protect against common web vulnerabilities.
- **Token Refresh on Demand**: The application only refreshes tokens when the backend returns a 401 (expired token), not on a timer.

### File Descriptions
- **index.html**: The main HTML file containing the application's structure, including placeholders for dynamic content and the message screen.
- **assets/css/styles.css**: Provides all styling for the application, with a focus on a responsive, modern aesthetic using CSS variables and Grid layout. Includes support for Arabic fonts and directionality.
- **assets/js/apiService.js**: Handles all backend communication. Responsible for authentication, refreshing access tokens (only on 401), and fetching screen design data.
- **assets/js/ui.js**: Manages all DOM manipulation and user interface logic. This includes rendering screen elements, showing/hiding the loader and message screen, and handling UI events.
- **assets/js/script.js**: The main entry point of the application. It orchestrates the `apiService` and `ui` modules and initializes the application.
- **web.config**: Configuration file for deploying the application on a Microsoft IIS server, pre-configured with important security headers.

## Notable Changes from Previous Versions
- **Removed Modal Popups**: All user messages and confirmations are now shown on a dedicated message screen that replaces the main content area.
- **No Periodic Data Refresh**: The app no longer refreshes data on a timer; it only refreshes when necessary (e.g., after a token refresh).
- **Critical Error Handling**: If initial data cannot be loaded, the app displays a blocking error screen and does not attempt to continue.
- **Improved Arabic Support**: Provided Arabic language support with proper UI changes to handle the RTL nature of the language.
- **Enhanced Visual Design**: The UI uses a modern, semi-transparent, and frosted-glass look to complement background images and improve readability.


