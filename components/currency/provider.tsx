"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CurrencyCode } from "@/lib/currencies";
import { defaultCurrencies } from "@/lib/currencies";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "MAD",
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("MAD");

  useEffect(() => {
    const stored = localStorage.getItem("displayCurrency") as CurrencyCode | null;
    if (stored && defaultCurrencies.some((c) => c.code === stored)) {
      setCurrencyState(stored);
    }
  }, []);

  function setCurrency(c: CurrencyCode) {
    setCurrencyState(c);
    localStorage.setItem("displayCurrency", c);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  return useContext(CurrencyContext);
}
