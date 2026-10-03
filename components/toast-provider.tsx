"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface Toast {
  id: string;
  message: string;
  type?: "info" | "success" | "warn" | "error";
  code?: string;
}

interface ToastContextType {
  addToast: (message: string, type?: "info" | "success" | "warn" | "error", code?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: "info" | "success" | "warn" | "error" = "info", code?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, code }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-10 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="terminal-panel px-3.5 py-2.5 shadow-xl text-xs font-mono flex items-center gap-2.5 pointer-events-auto border-l-2"
              style={{
                borderLeftColor:
                  toast.type === "success"
                    ? "var(--up)"
                    : toast.type === "warn"
                    ? "var(--warn)"
                    : toast.type === "error"
                    ? "var(--down)"
                    : "var(--accent)",
              }}
            >
              <span className="text-accent font-bold">&gt;</span>
              {toast.code && (
                <span className="px-1 py-0.5 bg-bg-inset border border-border text-[10px] text-accent">
                  {toast.code}
                </span>
              )}
              <span className="text-text font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
