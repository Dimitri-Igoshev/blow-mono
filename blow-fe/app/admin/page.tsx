export default function AdminPage() {
  return (
    <div style={{ height: "100vh", width: "100vw", margin: 0, padding: 0, position: "relative", zIndex: 999 }}>
      <iframe
        src="https://pro.igoshev.de/?project=blow"
        title="Admin Panel"
        style={{
          border: "none",
          width: "100%",
          height: "100%",
        }}
        allow="fullscreen"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}