"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  label?: ReactNode;
  className?: string;
  labelClassName?: string;
  indeterminate?: boolean;
}

export const Checkbox = ({
  label,
  className,
  labelClassName,
  indeterminate,
  checked,
  ...props
}: CheckboxProps) => {
  return (
    <label
      className={`inline-flex items-center cursor-pointer ${labelClassName || ""}`}
      style={{ gap: "0.5rem" }}
    >
      <motion.div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <input
          type="checkbox"
          className={`
            w-4 h-4 text-blue-600 border-gray-300 rounded
            focus:ring-blue-500 cursor-pointer
            ${className || ""}
          `}
          checked={checked || indeterminate}
          ref={(el) => {
            if (el) el.indeterminate = indeterminate || false;
          }}
          {...props}
        />
        {checked && !indeterminate && (
          <motion.div
            style={{
              position: "absolute",
              pointerEvents: "none",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <svg
              className="w-3 h-3 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        )}
      </motion.div>
      {label && (
        <motion.span
          animate={{
            opacity: checked ? 1 : 0.7,
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      )}
    </label>
  );
};
