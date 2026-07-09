interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name = "Unknown User", size = "md" }: AvatarProps) {
  const safeName = name.trim() || "Unknown User";

  const initials = safeName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colors = ["#4f7bff", "#22d3a5", "#a78bfa", "#f59e0b", "#f472b6"];
  const color = colors[safeName.charCodeAt(0) % colors.length];

  const sizeMap = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={`${sizeMap[size]} rounded-xl flex items-center justify-center font-semibold text-white flex-shrink-0 ring-1 ring-white/10`}
      style={{ background: `linear-gradient(135deg, ${color}dd, ${color}88)` }}
    >
      {initials}
    </div>
  );
}