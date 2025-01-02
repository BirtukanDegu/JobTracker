"use client";

import { ThemeProvider } from "@/context/themeContext";
import { ReduxProvider } from "@/redux/provider";

interface Props {
  children: React.ReactNode;
}

export default function CustomProvider({ children }: Props) {
  return (
    <ThemeProvider>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </ThemeProvider>
  );
}
