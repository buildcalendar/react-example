import { useEffect, useState } from "react";

export default function GoogleCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const error = params.get("error");
    const externalUserId = params.get("external_user_id");

    if (success === "true" && externalUserId) {
      // Store userId in localStorage so it persists
      localStorage.setItem("buildcalendar_external_user_id", externalUserId);
      setStatus("success");
      setMessage(`Successfully connected Google Calendar for user ${externalUserId}`);
      
      // Redirect back to home with query params so the hook can read them
      setTimeout(() => {
        window.location.href = `/?success=true&external_user_id=${externalUserId}`;
      }, 2000);
    } else if (error) {
      setStatus("error");
      setMessage(`OAuth failed: ${error}`);
    } else {
      setStatus("error");
      setMessage("Invalid callback parameters");
    }
  }, []);

  return (
    <div style={{ 
      padding: "2rem", 
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh"
    }}>
      {status === "loading" && (
        <>
          <h1>Processing Google Calendar Connection...</h1>
          <p>Please wait...</p>
        </>
      )}
      
      {status === "success" && (
        <>
          <h1 style={{ color: "green" }}>✅ Connected Successfully!</h1>
          <p>{message}</p>
          <p>Redirecting you back...</p>
        </>
      )}
      
      {status === "error" && (
        <>
          <h1 style={{ color: "red" }}>❌ Connection Failed</h1>
          <p>{message}</p>
          <button
            onClick={() => window.location.href = "/"}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </>
      )}
    </div>
  );
}
