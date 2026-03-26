"use client";

import { createContext, useContext, ReactNode } from "react";

// Lenis removed — using CSS scroll-snap for slide-based navigation
const LenisContext = createContext<null>(null);

export const useLenis = () => useContext(LenisContext);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <LenisContext.Provider value={null}>
      {children}
    </LenisContext.Provider>
  );
}
