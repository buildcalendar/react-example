import { useEffect, useMemo, useState } from "react";
import { createClient, type CalendarWithEvents } from "@buildcalendar/sdk";
import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";
import "@sx-premium/interactive-event-modal/index.css";
import "./App.css";
import CalendarView from "./CalendarView";

type CalendarPickerProps = {
  calendars: CalendarWithEvents[];
  selectedCalendarId: string | null;
  isLoadingCalendars: boolean;
  onChange: (calendarId: string) => void;
};

// Calendar picker component - allows switching between calendars
function CalendarPicker({
  calendars,
  selectedCalendarId,
  isLoadingCalendars,
  onChange,
}: CalendarPickerProps) {
  return (
    <select
      value={selectedCalendarId ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoadingCalendars || calendars.length === 0}
    >
      {calendars.length === 0 ? (
        <option value="">
          {isLoadingCalendars ? "Loading calendars..." : "No calendars"}
        </option>
      ) : (
        calendars.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.timezone})
          </option>
        ))
      )}
    </select>
  );
}

function FullStackCalendar() {
  const apiKey = import.meta.env.VITE_BUILDCALENDAR_API_KEY!;
  const externalUserId = "some-user-1"; // Replace with your user ID
  const baseUrl = 'https://buildcalendar.com/api/v1'; // Use SDK default. Set to custom URL only for local dev (e.g. "http://localhost:5173/api/v1")

  const client = useMemo(
    () => createClient({ apiKey, baseUrl }),
    [apiKey, baseUrl],
  );

  const [calendars, setCalendars] = useState<CalendarWithEvents[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(
    null,
  );
  const [isLoadingCalendars, setIsLoadingCalendars] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch calendars for the user
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIsLoadingCalendars(true);
      setError(null);
      try {
        const data = await client.calendars.byUser(externalUserId, {
          sync: true,
        });
        if (cancelled) return;

        setCalendars(data);
        setSelectedCalendarId((prev) => prev ?? data[0]?.id ?? null);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setIsLoadingCalendars(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [client, externalUserId]);

  const selectedCalendar = calendars.find((c) =>
    c.id === selectedCalendarId
  ) ?? null;

  // Function to initiate Google OAuth
  async function connectGoogle() {
    try {
      const callbackUrl = 'http://localhost:5175/google/callback'
      
      const { url } = await client.google.getAuthUrl({
        externalUserId,
        callbackUrl,
      });
      
      console.log('Received auth URL:', url);
      window.location.href = url;
    } catch (e) {
      console.error('Google OAuth error:', e);
      const errorMessage = e instanceof Error 
        ? `${e.message}${e.cause ? ` (${JSON.stringify(e.cause)})` : ''}` 
        : String(e);
      setError(errorMessage);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>BuildCalendar Full Stack Example</h1>
      
      {!apiKey && (
        <div style={{ 
          padding: "1rem", 
          backgroundColor: "#fff3cd", 
          border: "1px solid #ffc107",
          borderRadius: "4px",
          marginBottom: "1rem"
        }}>
          <strong>⚠️ Missing API Key</strong>
          <p>Please create a <code>.env</code> file with:</p>
          <code>VITE_BUILDCALENDAR_API_KEY=your_api_key_here</code>
        </div>
      )}
      
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={connectGoogle}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Connect Google Calendar
        </button>

        <CalendarPicker
          calendars={calendars}
          selectedCalendarId={selectedCalendarId}
          isLoadingCalendars={isLoadingCalendars}
          onChange={(id) => setSelectedCalendarId(id)}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!selectedCalendar && (
        <p>
          {isLoadingCalendars
            ? "Loading calendars..."
            : "Connect your Google Calendar and choose a calendar to render it."}
        </p>
      )}

      {selectedCalendar && (
        <CalendarView 
          key={selectedCalendar.id}
          calendar={selectedCalendar}
          apiKey={apiKey}
          baseUrl={baseUrl}
        />
      )}
    </div>
  );
}

export default FullStackCalendar;
