import { useCalendarApp } from "@buildcalendar/schedule-x";
import { ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import type { CalendarWithEvents } from "@buildcalendar/sdk";

type CalendarViewProps = {
  calendar: CalendarWithEvents;
  apiKey: string;
  baseUrl?: string;
};

export default function CalendarView({ calendar, apiKey, baseUrl }: CalendarViewProps) {
  const { calendarApp } = useCalendarApp({
    buildcalendarConfig: {
      apiKey,
      baseUrl,
      calendarId: calendar.id,
      enabled: true,
      interactive: true,
    },
    timezone: calendar.timezone,
    defaultView: "month-grid",
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
  });

  if (!calendarApp) {
    return <p>Loading calendar events...</p>;
  }

  return <ScheduleXCalendar calendarApp={calendarApp} />;
}
