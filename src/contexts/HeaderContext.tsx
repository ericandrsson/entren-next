"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface HeaderContextType {
  isSticky: boolean;
  setIsSticky: (isSticky: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [isSticky, setIsSticky] = useState(false);

  return (
    <HeaderContext.Provider value={{ isSticky, setIsSticky }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
