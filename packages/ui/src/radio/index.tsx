"use client";

import { createContext, useContext, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface RadioGroupContextValue {
  value: string | undefined;
  onChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps {
  children: ReactNode;
  value?: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
}

export const RadioGroup = ({
  children,
  value,
  onChange,
  name,
  className,
}: RadioGroupProps) => {
  return (
    <RadioGroupContext.Provider value={{ value, onChange, name }}>
      <div className={className} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

interface RadioProps
  extends Omit<HTMLMotionProps<"input">, "type" | "checked" | "onChange"> {
  value: string;
  label?: ReactNode;
  className?: string;
  labelClassName?: string;
}

export const Radio = ({
  value,
  label,
  className,
  labelClassName,
  id,
  ...props
}: RadioProps) => {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("Radio must be used within a RadioGroup");
  }

  const { value: selectedValue, onChange, name } = context;
  const isChecked = selectedValue === value;
  const radioId = id || `${name}-${value}`;

  return (
    <label
      htmlFor={radioId}
      className={labelClassName}
      style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", gap: "0.5rem" }}
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
        <motion.input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={isChecked}
          onChange={() => onChange(value)}
          className={className}
          style={{
            cursor: "pointer",
            width: "16px",
            height: "16px",
            margin: 0,
          }}
          {...props}
        />
        {isChecked && (
          <motion.div
            style={{
              position: "absolute",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "currentColor",
              pointerEvents: "none",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          />
        )}
      </motion.div>
      {label && (
        <motion.span
          animate={{
            opacity: isChecked ? 1 : 0.7,
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      )}
    </label>
  );
};

