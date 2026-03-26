"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const AnimationsEnabledContext = createContext<boolean | null>(null);

export function useAnimationsEnabled(): boolean {
  const value = useContext(AnimationsEnabledContext);
  // When null (SSR/initial), assume desktop to avoid flash; only mobile gets no-animation
  return value !== false;
}

interface AnimationsEnabledProviderProps {
  children: ReactNode;
}

export default function AnimationsEnabledProvider({ children }: AnimationsEnabledProviderProps) {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setEnabled(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <AnimationsEnabledContext.Provider value={enabled}>
      {children}
    </AnimationsEnabledContext.Provider>
  );
}
