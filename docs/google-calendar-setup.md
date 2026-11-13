# Google Calendar and Meet setup

The app can save classes without Google credentials. To create a Calendar event and a unique Google Meet link for each saved class, configure a Google OAuth client and a refresh token for `armann.shah28@gmail.com`.

## Environment variables

Add these to your local `.env` file. Keep the client secret and refresh token private; `.env` is git-ignored.

```env
GOOGLE_CLIENT_ID="your-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-oauth-client-secret"
GOOGLE_REFRESH_TOKEN="your-offline-refresh-token"
GOOGLE_CALENDAR_EMAIL="armann.shah28@gmail.com"
GOOGLE_CALENDAR_ID="primary"
```

## Google Cloud setup

1. Create or select a project in Google Cloud Console and enable the Google Calendar API.
2. Configure the OAuth consent screen and add `armann.shah28@gmail.com` as a test user if the app is in testing mode.
3. Create an OAuth client for a web application. For a local development refresh token obtained through OAuth 2.0 Playground, authorize `https://developers.google.com/oauthplayground` as a redirect URI.
4. In OAuth 2.0 Playground settings, enable **Use your own OAuth credentials** and enter the client ID and secret.
5. Authorize `openid email https://www.googleapis.com/auth/calendar.events` while signed in as `armann.shah28@gmail.com`, then exchange the code for tokens and copy the refresh token into `.env`.
6. Restart the development server.

The server refreshes short-lived access tokens as needed, verifies the Google account email before creating an event, and does not send Calendar invitation emails. Students receive the Meet link inside their dashboard.
