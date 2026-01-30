import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7FF] dark:bg-gray-900 p-4">
        {children}
      </div>
    </ThemeProvider>
  );
}
