type CalendarEmptyStateProps = {
  isLoading: boolean;
};

export default function CalendarEmptyState({ isLoading }: CalendarEmptyStateProps) {
  return (
    <p>
      {isLoading
        ? "Loading calendars..."
        : "Connect your Google Calendar and choose a calendar to render it."}
    </p>
  );
}
