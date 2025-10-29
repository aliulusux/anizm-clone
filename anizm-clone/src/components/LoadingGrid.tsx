export default function LoadingGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "16px",
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="glass animate-pulse"
          style={{
            height: "220px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.05)",
          }}
        />
      ))}
    </div>
  );
}