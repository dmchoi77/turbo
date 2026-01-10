"use client";

import { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({
  children,
  className,
  appName,
  ...props
}: ButtonProps) => {
  return (
    <motion.button
      className={className}
      onClick={() => alert(`Hello from your ${appName} app!`)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
