"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import { motion } from "framer-motion";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  children: ReactNode;
  defaultTab: string;
  className?: string;
}

export const Tabs = ({ children, defaultTab, className }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className || ""}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: ReactNode;
  className?: string;
}

export const TabList = ({ children, className }: TabListProps) => {
  return (
    <div
      className={`flex border-b border-gray-200 ${className || ""}`}
      role="tablist"
    >
      {children}
    </div>
  );
};

interface TabProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const Tab = ({ value, children, className }: TabProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tab must be used within Tabs");

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        px-4 py-2 font-medium text-sm
        ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}
        ${className || ""}
      `}
      role="tab"
      aria-selected={isActive}
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          layoutId="activeTab"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
};

interface TabPanelsProps {
  children: ReactNode;
  className?: string;
}

export const TabPanels = ({ children, className }: TabPanelsProps) => {
  return <div className={className || ""}>{children}</div>;
};

interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabPanel = ({ value, children, className }: TabPanelProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabPanel must be used within Tabs");

  const { activeTab } = context;
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <motion.div
      className={className || ""}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

