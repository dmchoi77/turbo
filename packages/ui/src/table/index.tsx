"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface TableColumn<T = any> {
  key: string;
  header: string;
  render?: (value: any, row: T, index: number) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  onRowClick?: (row: T, index: number) => void;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  className,
  striped = false,
  hoverable = false,
  onRowClick,
}: TableProps<T>) => {
  return (
    <div className={`overflow-x-auto ${className || ""}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${column.align === "center" ? "text-center" : ""}
                  ${column.align === "right" ? "text-right" : ""}
                `}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`bg-white divide-y divide-gray-200 ${striped ? "divide-y" : ""}`}>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              className={`
                ${striped && rowIndex % 2 === 0 ? "bg-gray-50" : ""}
                ${hoverable ? "hover:bg-gray-100 cursor-pointer" : ""}
              `}
              onClick={() => onRowClick?.(row, rowIndex)}
              whileHover={hoverable ? { backgroundColor: "#f3f4f6" } : {}}
              transition={{ duration: 0.2 }}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`
                    px-6 py-4 whitespace-nowrap text-sm text-gray-900
                    ${column.align === "center" ? "text-center" : ""}
                    ${column.align === "right" ? "text-right" : ""}
                  `}
                >
                  {column.render
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

