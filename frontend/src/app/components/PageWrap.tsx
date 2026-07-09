import { motion } from "motion/react";

interface PageWrapProps {
  children: React.ReactNode;
  pageKey: string;
}

export function PageWrap({ children, pageKey }: PageWrapProps) {
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
