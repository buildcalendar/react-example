import { useEffect, useMemo, useState } from "react";
import { createClient, type CalendarWithEvents } from "@buildcalendar/sdk";
import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";
import "@sx-premium/interactive-event-modal/index.css";
import "./App.css";
import CalendarView from "./CalendarView";
import ApiKeyWarning from "./components/ApiKeyWarning";
import ConnectGoogleButton from "./components/ConnectGoogleButton";
import CalendarEmptyState from "./components/CalendarEmptyState";
import { useGoogleOAuth } from "./hooks/useGoogleOAuth";

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
  const baseUrl = undefined; // e.g. "http://localhost:5173/api/v1"

  const client = useMemo(
    () => createClient({ apiKey, baseUrl }),
    [apiKey, baseUrl],
  );

  const { externalUserId, isSigningIn, error: oauthError, startGoogleSignIn } =
    useGoogleOAuth({ client, callbackPath: "/google/callback" });

  const [calendars, setCalendars] = useState<CalendarWithEvents[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(
    null,
  );
  const [isLoadingCalendars, setIsLoadingCalendars] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  // Fetch calendars for the user
  useEffect(() => {
    if (!externalUserId) return;

    let cancelled = false;

    async function run() {
      setIsLoadingCalendars(true);
      setCalendarError(null);
      try {
        const data = await client.calendars.byUser(externalUserId, {
          sync: true,
        });
        if (cancelled) return;

        setCalendars(data);
        setSelectedCalendarId((prev) => prev ?? data[0]?.id ?? null);
      } catch (e) {
        if (cancelled) return;
        setCalendarError(e instanceof Error ? e.message : String(e));
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

  if (!externalUserId) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Connect your Google Calendar</h1>
        <p style={{ marginBottom: "1.5rem" }}>
          Sign in with Google to view and manage your calendars
        </p>
        <button
          onClick={startGoogleSignIn}
          disabled={isSigningIn}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            background: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: isSigningIn ? "not-allowed" : "pointer",
          }}
        >
          {isSigningIn ? "Signing in..." : "Sign in with Google"}
        </button>
        {oauthError && <p style={{ color: "red", marginTop: "1rem" }}>{oauthError}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <CalendarPicker
          calendars={calendars}
          selectedCalendarId={selectedCalendarId}
          isLoadingCalendars={isLoadingCalendars}
          onChange={(id) => setSelectedCalendarId(id)}
        />
        <p style={{ margin: 0, color: "#059669", fontWeight: "bold" }}>
          Interactive
        </p>
      </div>

      {calendarError && <p style={{ color: "red" }}>{calendarError}</p>}

      {!selectedCalendar && (
        <p>
          {isLoadingCalendars
            ? "Loading calendars..."
            : "Choose a calendar to render it."}
        </p>
      )}

      {selectedCalendar && (
        <div>
          <p style={{ marginBottom: "1rem", color: "#6b7280", fontSize: "0.875rem" }}>
            Double-click on any date/time to create an event. Click events to edit/delete.
          </p>
          <CalendarView 
            key={selectedCalendar.id}
            calendar={selectedCalendar}
            apiKey={apiKey}
            baseUrl={baseUrl}
            client={client}
          />
        </div>
      )}
    </div>
  );
}

export default FullStackCalendar;
