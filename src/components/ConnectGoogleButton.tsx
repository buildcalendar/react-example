type ConnectGoogleButtonProps = {
  onClick: () => void;
};

export default function ConnectGoogleButton({ onClick }: ConnectGoogleButtonProps) {
  return (
    <button
      onClick={onClick}
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
  );
}
