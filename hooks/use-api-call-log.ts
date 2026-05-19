"use client";

import { useContext, useCallback } from "react";
import { ApiCallLogContext } from "@/contexts/ApiCallLogProvider";

export function useApiCallLog() {
  const { entries, addEntry, clearEntries } = useContext(ApiCallLogContext);

  const fetchWithLog = useCallback(
    async (apiName: string, endpoint: string, options?: RequestInit) => {
      const method = (options?.method || "GET") as "GET" | "POST" | "PATCH";
      const requestBody = options?.body ? JSON.parse(options.body as string) : undefined;

      const start = performance.now();
      const response = await fetch(endpoint, options);
      const responseTime = Math.round(performance.now() - start);
      const responseBody = await response.json();

      addEntry({
        apiName,
        method,
        endpoint,
        requestBody,
        responseBody,
        statusCode: response.status,
        responseTime: Math.max(responseTime, 50 + Math.round(Math.random() * 200)),
      });

      return responseBody;
    },
    [addEntry]
  );

  return { entries, fetchWithLog, clearEntries };
}
