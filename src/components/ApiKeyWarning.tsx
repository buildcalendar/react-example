export default function ApiKeyWarning() {
  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#fff3cd",
        border: "1px solid #ffc107",
        borderRadius: "4px",
        marginBottom: "1rem",
      }}
    >
      <strong>⚠️ Missing API Key</strong>
      <p>
        Please create a <code>.env</code> file with:
      </p>
      <code>VITE_BUILDCALENDAR_API_KEY=your_api_key_here</code>
    </div>
  );
}
