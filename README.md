# Ticketing Application

## Overview
The Bank Ticketing Application is a modern, responsive web application designed for bank branches to manage customer service queues efficiently. It provides a clean, user-friendly interface for customers to select services and receive tickets, with a focus on reliability and user experience.

## Features
- **Dynamic UI Rendering**: Buttons and screen information are rendered dynamically based on data fetched from a backend API.
- **Asynchronous API Communication**: Handles authentication, token refreshing, and data fetching without blocking the UI.
- **Modern User Feedback**: Includes a loading spinner during initial startup and a non-blocking modal for user messages and ticket confirmations.
- **Robust Error Handling**:
    - Displays user-friendly messages for both critical startup failures and non-critical API errors.
    - Logs all JavaScript errors with timestamps to the browser console for easier debugging.
- **Responsive Design**: The layout adapts seamlessly to various screen sizes, from large kiosk displays to tablets and mobile devices.
- **Secure by Default**: Includes a `web.config` for IIS deployments with security headers (CSP, HSTS, X-Frame-Options) to protect against common web vulnerabilities.

### File Descriptions
- **index.html**: The main HTML file containing the application's structure, including placeholders for dynamic content and the message modal.
- **assets/css/styles.css**: Provides all styling for the application, with a focus on a responsive, modern aesthetic using CSS variables and Grid layout.
- **assets/js/apiService.js**: Handles all backend communication. It is responsible for authentication, refreshing access tokens, and fetching screen design data.
- **assets/js/ui.js**: Manages all DOM manipulation and user interface logic. This includes rendering screen elements, showing/hiding the loader and modal, and handling UI events.
- **assets/js/script.js**: The main entry point of the application. It orchestrates the `apiService` and `ui` modules, initializes the application, and sets up data refresh intervals.
- **web.config**: Configuration file for deploying the application on a Microsoft IIS server, pre-configured with important security headers.


