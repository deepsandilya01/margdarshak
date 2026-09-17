# Setting up Google OAuth 2.0 for BIS-SATHI

This document explains how to set up the Google Cloud Console to enable Google OAuth 2.0 authentication for the BIS-SATHI Primary Server.

## Prerequisites

1. A Google account.
2. Access to the [Google Cloud Console](https://console.cloud.google.com/).

## Steps to Configure

### 1. Create a Project
- Go to the Google Cloud Console.
- Click on the project dropdown in the top-left corner and click **New Project**.
- Name it `BIS-SATHI` and click **Create**.

### 2. Configure the OAuth Consent Screen
- In the left sidebar, navigate to **APIs & Services > OAuth consent screen**.
- Select **External** (unless this app is restricted to a Google Workspace org).
- Click **Create**.
- Fill in the required fields (App Name: `BIS-SATHI`, User Support Email, Developer Contact Information).
- Click **Save and Continue** through the Scopes and Test Users screens.

### 3. Create OAuth Credentials
- Navigate to **APIs & Services > Credentials**.
- Click **Create Credentials** at the top, and select **OAuth client ID**.
- Select **Web application** as the Application Type.
- Under **Authorized JavaScript origins**, add:
  - `http://localhost:5000`
  - `http://localhost:5173`
- Under **Authorized redirect URIs**, add exactly what is configured in your `.env` for `GOOGLE_CALLBACK_URL`:
  - `http://localhost:5000/api/v1/auth/google/callback`
- Click **Create**.

### 4. Update the Primary Server Environment
- A modal will appear displaying your **Client ID** and **Client Secret**.
- Copy these values into your `.env` file in the `primary-server` directory:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
FRONTEND_AUTH_CALLBACK_URL=http://localhost:5173/auth/callback
```

> **IMPORTANT**: Never commit the `.env` file or expose your `GOOGLE_CLIENT_SECRET` to the frontend or any public repository.

### 5. Testing the Implementation
- Start the server using `npm run dev`.
- In your browser, navigate to:
  `http://localhost:5000/api/v1/auth/google`
- This should redirect you to Google's login screen. After successful authentication, it will redirect you to your frontend callback URL (`FRONTEND_AUTH_CALLBACK_URL`) with a securely generated validation code in the URL query parameters (e.g., `?code=xxxx`).
- The frontend will then POST this code to `http://localhost:5000/api/v1/auth/google/verify` to complete the token handoff securely.
