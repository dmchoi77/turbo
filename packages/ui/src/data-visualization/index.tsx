"use client";

import { useState, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  type Variants,
  type Transition,
} from "framer-motion";

// Complex animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const chartVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Complex data processing utilities
interface DataPoint {
  x: number;
  y: number;
  label?: string;
}

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

// Data normalization functions
function normalizeData(data: number[], min: number, max: number): number[] {
  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);
  const range = dataMax - dataMin || 1;
  return data.map((value) => ((value - dataMin) / range) * (max - min) + min);
}

function calculateLinePath(
  points: DataPoint[],
  width: number,
  height: number
): string {
  if (points.length === 0) return "";

  const xScale = width / (points.length - 1 || 1);
  const yValues = points.map((p) => p.y);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const yRange = yMax - yMin || 1;
  const yScale = height / yRange;

  let path = `M ${0} ${height - (points[0].y - yMin) * yScale}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${i * xScale} ${height - (points[i].y - yMin) * yScale}`;
  }
  return path;
}

function calculateSmoothLinePath(
  points: DataPoint[],
  width: number,
  height: number
): string {
  if (points.length < 2) return "";

  const xScale = width / (points.length - 1 || 1);
  const yValues = points.map((p) => p.y);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const yRange = yMax - yMin || 1;
  const yScale = height / yRange;

  let path = `M ${0} ${height - (points[0].y - yMin) * yScale}`;

  for (let i = 1; i < points.length; i++) {
    const x1 = (i - 1) * xScale;
    const y1 = height - (points[i - 1].y - yMin) * yScale;
    const x2 = i * xScale;
    const y2 = height - (points[i].y - yMin) * yScale;
    const cp1x = x1 + (x2 - x1) / 2;
    const cp1y = y1;
    const cp2x = x1 + (x2 - x1) / 2;
    const cp2y = y2;
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  }

  return path;
}

function calculatePiePath(
  value: number,
  total: number,
  startAngle: number,
  radius: number,
  centerX: number,
  centerY: number
): string {
  const angle = (value / total) * 360;
  const endAngle = startAngle + angle;
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;

  const x1 = centerX + radius * Math.cos(startAngleRad);
  const y1 = centerY + radius * Math.sin(startAngleRad);
  const x2 = centerX + radius * Math.cos(endAngleRad);
  const y2 = centerY + radius * Math.sin(endAngleRad);

  const largeArcFlag = angle > 180 ? 1 : 0;

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

// Color schemes
const colorSchemes = {
  primary: ["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"],
  success: ["#10b981", "#34d399", "#6ee7b7", "#d1fae5"],
  warning: ["#f59e0b", "#fbbf24", "#fcd34d", "#fef3c7"],
  error: ["#ef4444", "#f87171", "#fca5a5", "#fee2e2"],
  gradient: ["#667eea", "#764ba2", "#f093fb", "#4facfe"],
};

// Animated Line Chart Component
interface AnimatedLineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  smooth?: boolean;
}

function AnimatedLineChart({
  data,
  width = 400,
  height = 200,
  color = "#3b82f6",
  smooth = false,
}: AnimatedLineChartProps) {
  const path = useMemo(
    () =>
      smooth
        ? calculateSmoothLinePath(data, width, height)
        : calculateLinePath(data, width, height),
    [data, width, height, smooth]
  );

  const pathLength = useMotionValue(0);
  const pathSpring = useSpring(pathLength, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      variants={chartVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width, height, position: "relative" }}
    >
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient
            id={`lineGradient-${color}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke={`url(#lineGradient-${color})`}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.5 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
        />
        {data.map((point, index) => (
          <motion.circle
            key={index}
            cx={(index / (data.length - 1 || 1)) * width}
            cy={
              height -
              ((point.y - Math.min(...data.map((p) => p.y))) /
                (Math.max(...data.map((p) => p.y)) -
                  Math.min(...data.map((p) => p.y)) || 1)) *
                height
            }
            r="4"
            fill={color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.5, r: 6 }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// Animated Bar Chart Component
interface AnimatedBarChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  colorScheme?: keyof typeof colorSchemes;
}

function AnimatedBarChart({
  data,
  width = 400,
  height = 200,
  colorScheme = "primary",
}: AnimatedBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const barWidth = width / data.length - 10;
  const colors = colorSchemes[colorScheme];

  return (
    <motion.div
      variants={chartVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width, height, position: "relative" }}
    >
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * height;
          const x = index * (width / data.length) + 5;
          const y = height - barHeight;

          return (
            <motion.g key={index}>
              <motion.rect
                x={x}
                y={height}
                width={barWidth}
                height={0}
                fill={item.color || colors[index % colors.length]}
                initial={{ height: 0, y: height }}
                animate={{ height: barHeight, y }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.1,
                }}
                whileHover={{ opacity: 0.8, scale: 1.05 }}
              />
              <motion.text
                x={x + barWidth / 2}
                y={height + 15}
                textAnchor="middle"
                fontSize="12"
                fill="#666"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {item.label}
              </motion.text>
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}

// Animated Pie Chart Component
interface AnimatedPieChartProps {
  data: ChartData[];
  size?: number;
  colorScheme?: keyof typeof colorSchemes;
}

function AnimatedPieChart({
  data,
  size = 200,
  colorScheme = "primary",
}: AnimatedPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;
  const colors = colorSchemes[colorScheme];

  let currentAngle = 0;

  return (
    <motion.div
      variants={chartVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg width={size} height={size}>
        {data.map((item, index) => {
          const startAngle = currentAngle;
          const path = calculatePiePath(
            item.value,
            total,
            startAngle,
            radius,
            centerX,
            centerY
          );
          currentAngle += (item.value / total) * 360;

          return (
            <motion.path
              key={index}
              d={path}
              fill={item.color || colors[index % colors.length]}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
                delay: index * 0.1,
              }}
              whileHover={{ scale: 1.1, opacity: 0.9 }}
            />
          );
        })}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.6}
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: data.length * 0.1,
            type: "spring",
            stiffness: 200,
          }}
        />
      </svg>
    </motion.div>
  );
}

// Main Data Visualization Component
export interface DataVisualizationProps {
  lineData?: DataPoint[];
  barData?: ChartData[];
  pieData?: ChartData[];
  width?: number;
  height?: number;
  colorScheme?: keyof typeof colorSchemes;
  showLineChart?: boolean;
  showBarChart?: boolean;
  showPieChart?: boolean;
  className?: string;
}

export const DataVisualization = ({
  lineData = [
    { x: 0, y: 20 },
    { x: 1, y: 35 },
    { x: 2, y: 45 },
    { x: 3, y: 30 },
    { x: 4, y: 50 },
    { x: 5, y: 60 },
    { x: 6, y: 55 },
  ],
  barData = [
    { label: "Jan", value: 40 },
    { label: "Feb", value: 60 },
    { label: "Mar", value: 50 },
    { label: "Apr", value: 70 },
    { label: "May", value: 80 },
  ],
  pieData = [
    { label: "A", value: 30 },
    { label: "B", value: 25 },
    { label: "C", value: 20 },
    { label: "D", value: 25 },
  ],
  width = 400,
  height = 200,
  colorScheme = "primary",
  showLineChart = true,
  showBarChart = true,
  showPieChart = true,
  className,
}: DataVisualizationProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const dragTransition: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        padding: "2rem",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <motion.h2
        variants={itemVariants}
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "#1f2937",
        }}
      >
        Data Visualization Dashboard
      </motion.h2>

      <AnimatePresence mode="wait">
        {showLineChart && (
          <motion.div
            key="line-chart"
            variants={itemVariants}
            layout
            style={{
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
            }}
          >
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                marginBottom: "1rem",
                fontSize: "1.2rem",
                color: "#374151",
              }}
            >
              Line Chart
            </motion.h3>
            <AnimatedLineChart
              data={lineData}
              width={width}
              height={height}
              color={colorSchemes[colorScheme][0]}
              smooth
            />
          </motion.div>
        )}

        {showBarChart && (
          <motion.div
            key="bar-chart"
            variants={itemVariants}
            layout
            style={{
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
            }}
          >
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                marginBottom: "1rem",
                fontSize: "1.2rem",
                color: "#374151",
              }}
            >
              Bar Chart
            </motion.h3>
            <AnimatedBarChart
              data={barData}
              width={width}
              height={height}
              colorScheme={colorScheme}
            />
          </motion.div>
        )}

        {showPieChart && (
          <motion.div
            key="pie-chart"
            variants={itemVariants}
            layout
            style={{
              padding: "1rem",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                marginBottom: "1rem",
                fontSize: "1.2rem",
                color: "#374151",
              }}
            >
              Pie Chart
            </motion.h3>
            <AnimatedPieChart
              data={pieData}
              size={Math.min(width, 300)}
              colorScheme={colorScheme}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        drag
        dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        style={{
          x: springX,
          y: springY,
          width: "100px",
          height: "100px",
          backgroundColor: colorSchemes[colorScheme][0],
          borderRadius: "12px",
          cursor: "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          boxShadow: isDragging
            ? "0 10px 20px rgba(0,0,0,0.3)"
            : "0 4px 6px rgba(0,0,0,0.1)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, cursor: "grabbing" }}
        transition={dragTransition}
      >
        <motion.span
          animate={{ rotate: isDragging ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          Drag Me
        </motion.span>
      </motion.div>
    </motion.div>
  );
};
