import { motion } from "motion/react";

interface GlowBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  small?: boolean;
}

export function GlowBtn({ children, onClick, small }: GlowBtnProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-2 ${small ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"} rounded-xl font-semibold text-white`}
      style={{
        background: "linear-gradient(135deg,#4f7bff,#7b5ff8)",
        boxShadow: "0 6px 20px rgba(79,123,255,0.35)"
      }}
    >
      {children}
    </motion.button>
  );
}
