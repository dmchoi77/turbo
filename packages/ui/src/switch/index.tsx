"use client";

import { InputHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  label?: string;
  labelClassName?: string;
}

export const Switch = ({
  label,
  labelClassName,
  checked,
  ...props
}: SwitchProps) => {
  return (
    <label
      className={`inline-flex items-center cursor-pointer ${labelClassName || ""}`}
      style={{ gap: "0.5rem" }}
    >
      <motion.div
        className={`
          relative inline-flex items-center
          w-11 h-6 rounded-full
          ${checked ? "bg-blue-600" : "bg-gray-300"}
          transition-colors duration-200
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          {...props}
        />
        <motion.span
          className={`
            absolute left-1 top-1
            w-4 h-4 bg-white rounded-full
            shadow-md
          `}
          animate={{
            x: checked ? 20 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        />
      </motion.div>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
    </label>
  );
};
