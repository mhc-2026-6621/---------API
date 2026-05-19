"use client";

import { createContext, useState, useCallback, ReactNode } from "react";
import { ApiCallEntry } from "@/types";

export const ApiCallLogContext = createContext<{
  entries: ApiCallEntry[];
  addEntry: (entry: Omit<ApiCallEntry, "id" | "timestamp">) => void;
  clearEntries: () => void;
}>({ entries: [], addEntry: () => {}, clearEntries: () => {} });

const MAX_API_CALL_LOG_ENTRIES = 20;

let entryId = 0;

export function ApiCallLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ApiCallEntry[]>([]);

  const addEntry = useCallback((entry: Omit<ApiCallEntry, "id" | "timestamp">) => {
    entryId++;
    setEntries((prev) => [
      { ...entry, id: `call_${entryId}`, timestamp: new Date() },
      ...prev,
    ].slice(0, MAX_API_CALL_LOG_ENTRIES));
  }, []);

  const clearEntries = useCallback(() => setEntries([]), []);

  return (
    <ApiCallLogContext.Provider value={{ entries, addEntry, clearEntries }}>
      {children}
    </ApiCallLogContext.Provider>
  );
}
