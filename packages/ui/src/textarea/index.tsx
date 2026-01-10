"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  textareaClassName?: string;
  fullWidth?: boolean;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      textareaClassName,
      fullWidth = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? "w-full" : ""} ${className || ""}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          style={{ display: "inline-block", width: "100%" }}
        >
          <textarea
            ref={ref}
            rows={rows}
            className={`
              w-full px-4 py-2 border rounded-lg resize-y
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-transform duration-200
              ${error ? "border-red-500" : "border-gray-300"}
              ${textareaClassName || ""}
            `}
            {...props}
          />
        </motion.div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
