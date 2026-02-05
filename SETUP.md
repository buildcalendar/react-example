# BuildCalendar Full Stack Setup

This project demonstrates how to set up Google Calendar authentication and event loading using BuildCalendar SDK.

## Setup Instructions

### 1. Install Dependencies

All required dependencies are already installed:
- `@buildcalendar/sdk` - BuildCalendar SDK
- `@buildcalendar/schedule-x` - Schedule-X adapter
- `@schedule-x/react`, `@schedule-x/calendar`, `@schedule-x/theme-default` - Schedule-X packages
- `@sx-premium/interactive-event-modal` - Interactive event modal
- `temporal-polyfill` - Temporal API polyfill
- `react-router-dom` - For routing OAuth callback

### 2. Configure API Key

Create a `.env` file in the root directory (already created but blocked by .gitignore):

```
VITE_BUILDCALENDAR_API_KEY=your_api_key_here
```

Get your API key from [https://buildcalendar.com](https://buildcalendar.com)

**Current API key in use:** `bck_F19K6vrgjjT2yQ2r8UP-qOpYSH29hpMdVmXnRTBM7zE`

### 3. Configure External User ID

In `src/App.tsx`, update the `externalUserId` to match your user identifier:

```typescript
const externalUserId = "user_123"; // Replace with your user ID
```

### 4. Run the Development Server

```bash
npm run dev
```

## How It Works

### Authentication Flow

1. **Connect Google Calendar**: Click the "Connect Google Calendar" button
2. **OAuth Redirect**: User is redirected to Google OAuth
3. **Callback**: After authorization, Google redirects back to `/google/callback`
4. **Load Calendars**: The app automatically fetches all calendars for the user
5. **Display Events**: Select a calendar from the dropdown to view its events

### Key Features

- ✅ Google Calendar OAuth authentication
- ✅ Fetch all calendars for a user with `sync: true` (pulls latest from Google)
- ✅ Calendar switcher dropdown
- ✅ Interactive calendar with Schedule-X
- ✅ Multiple views (Day, Week, Month Grid)
- ✅ Event modal support
- ✅ Timezone support

### Project Structure

```
src/
├── App.tsx              # Main calendar component with OAuth and calendar loading
├── GoogleCallback.tsx   # OAuth callback handler
├── main.tsx            # Router setup with routes
└── index.css           # Styles
```

### Components

**App.tsx**
- Initializes BuildCalendar client
- Handles Google OAuth flow
- Fetches user calendars with events
- Renders calendar picker and Schedule-X calendar

**GoogleCallback.tsx**
- Processes OAuth callback parameters
- Shows success/error states
- Redirects back to home on success

### API Reference

Based on [BuildCalendar Full Stack Setup Documentation](https://buildcalendar.com/docs/full-stack-setup)

**Get OAuth URL:**
```typescript
const { url } = await client.google.getAuthUrl({
  externalUserId,
  callbackUrl: "https://your-app.com/google/callback",
});
```

**Fetch Calendars:**
```typescript
const calendars = await client.calendars.byUser("user_123", { sync: true });
```

## Troubleshooting

- **"No calendars" message**: Make sure you've connected your Google Calendar first
- **API key errors**: Check that your `.env` file has the correct API key
- **Callback not working**: Ensure your callback URL matches what's configured in BuildCalendar dashboard
- **Events not loading**: Make sure `sync: true` is set when fetching calendars

## Next Steps

- Customize the calendar views and styling
- Add event creation/editing capabilities
- Implement calendar filtering
- Add more calendar providers (Microsoft, Apple, etc.)

For more information, visit the [BuildCalendar documentation](https://buildcalendar.com/docs).
