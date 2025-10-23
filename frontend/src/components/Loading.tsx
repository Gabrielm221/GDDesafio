export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} 
    >
      <div
        className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent"
        style={{
          borderColor: "var(--primary)",
          borderTopColor: "transparent",
        }}
      ></div>
    </div>
  );
}
