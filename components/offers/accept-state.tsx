"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AcceptState {
  accepted: boolean;
  setAccepted: (v: boolean) => void;
}

const AcceptContext = createContext<AcceptState | null>(null);

/**
 * Shares the "accepted" flag between the sidebar ContactPanel and the
 * mobile sticky action bar so both surfaces stay in sync without prop
 * drilling through the server-rendered offer page.
 */
export function AcceptProvider({ children }: { children: ReactNode }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <AcceptContext.Provider value={{ accepted, setAccepted }}>{children}</AcceptContext.Provider>
  );
}

export function useAccept(): AcceptState {
  const ctx = useContext(AcceptContext);
  if (!ctx) throw new Error("useAccept must be used within AcceptProvider");
  return ctx;
}
