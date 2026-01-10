"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AvatarProps {
  src?: string;
  alt?: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

export const Avatar = ({
  src,
  alt,
  children,
  size = "md",
  className,
  onClick,
}: AvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  return (
    <motion.div
      className={`
        rounded-full bg-gray-300 flex items-center justify-center
        overflow-hidden
        ${sizeClasses[size]}
        ${onClick ? "cursor-pointer" : ""}
        ${className || ""}
      `}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {src ? (
        <img src={src} alt={alt || ""} className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-600 font-medium">{children}</span>
      )}
    </motion.div>
  );
};

