"use client";

import { motion } from "framer-motion";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  label?: string;
}

export const Divider = ({
  orientation = "horizontal",
  className,
  label,
}: DividerProps) => {
  if (orientation === "vertical") {
    return (
      <motion.div
        className={`w-px bg-gray-300 self-stretch ${className || ""}`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.3 }}
      />
    );
  }

  return (
    <div className={`flex items-center ${className || ""}`}>
      <motion.div
        className="flex-1 h-px bg-gray-300"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
      {label && (
        <>
          <span className="px-4 text-sm text-gray-500">{label}</span>
          <motion.div
            className="flex-1 h-px bg-gray-300"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </>
      )}
    </div>
  );
};

