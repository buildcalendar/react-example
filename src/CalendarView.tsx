import { useMemo } from "react";
import { useCalendarApp, createEventHandlers } from "@buildcalendar/schedule-x";
import { ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import {
  createEventsServicePlugin,
  createEventRecurrencePlugin,
} from "@schedule-x/event-recurrence";
import { createInteractiveEventModal } from "@sx-premium/interactive-event-modal";
import type { CalendarWithEvents } from "@buildcalendar/sdk";
import type { createClient } from "@buildcalendar/sdk";

type CalendarViewProps = {
  calendar: CalendarWithEvents;
  apiKey: string;
  baseUrl?: string;
  client: ReturnType<typeof createClient>;
};

export default function CalendarView({ calendar, apiKey, baseUrl, client }: CalendarViewProps) {
  const eventsService = useMemo(() => createEventsServicePlugin(), []);
  const eventRecurrence = useMemo(() => createEventRecurrencePlugin(), []);

  const eventHandlers = useMemo(() => {
    return createEventHandlers(
      client,
      calendar.id,
      calendar.timezone,
    );
  }, [client, calendar.id, calendar.timezone]);

  const interactiveModal = useMemo(() => {
    return createInteractiveEventModal({
      eventsService,
      onAddEvent: eventHandlers.onAddEvent,
      onDeleteEvent: eventHandlers.onDeleteEvent,
    });
  }, [eventHandlers, eventsService]);

  const { calendarApp } = useCalendarApp({
    buildcalendarConfig: {
      apiKey,
      baseUrl,
      calendarId: calendar.id,
      enabled: true,
      interactiveEventModal: interactiveModal,
    },
    timezone: calendar.timezone,
    defaultView: "month-grid",
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    plugins: [eventsService, eventRecurrence, interactiveModal],
    callbacks: { onEventUpdate: eventHandlers.onEventUpdate },
  });

  if (!calendarApp) {
    return <p>Loading calendar events...</p>;
  }

  return <ScheduleXCalendar calendarApp={calendarApp} />;
}
