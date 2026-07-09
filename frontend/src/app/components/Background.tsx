export function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 10% 0%, rgba(79,123,255,0.16) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(34,211,165,0.10) 0%, transparent 60%), linear-gradient(160deg, #060d1f 0%, #0a1628 50%, #060f22 100%)"
      }} />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-[0.07]" style={{ background: "#4f7bff" }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-[0.06]" style={{ background: "#22d3a5" }} />
    </div>
  );
}
