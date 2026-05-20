"use client";

import { useState } from "react";
import { useApiCallLog } from "@/hooks/use-api-call-log";
import { cn } from "@/lib/format-utils";

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PATCH: "bg-amber-100 text-amber-700",
};

export function ApiCallViewer() {
  const { entries } = useApiCallLog();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#1e3a5f] text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-[#2d5a8e] transition-colors flex items-center gap-2"
      >
        <span className="font-mono text-sm">&lt;/&gt;</span>
        <span className="text-sm">API</span>
        {entries.length > 0 && (
          <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {entries.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div
            className="absolute right-0 top-0 h-full w-[500px] bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1e3a5f] text-white px-4 py-3 flex items-center justify-between">
              <h2 className="font-bold">APIコール確認パネル</h2>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white text-xl">
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {entries.length === 0 ? (
                <p className="text-center text-gray-400 mt-8">まだAPIコールがありません</p>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg overflow-hidden">
                    <button
                      className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-50 text-left"
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <span className={cn("px-2 py-0.5 rounded text-xs font-mono font-bold", METHOD_COLORS[entry.method])}>
                        {entry.method}
                      </span>
                      <span className="text-sm font-mono text-gray-700 truncate flex-1">{entry.endpoint}</span>
                      <span className="text-xs text-gray-400">{entry.responseTime}ms</span>
                      <span className={cn("text-xs font-mono", entry.statusCode < 300 ? "text-green-600" : "text-red-600")}>
                        {entry.statusCode}
                      </span>
                    </button>
                    {expandedId === entry.id && (
                      <div className="border-t bg-gray-50 p-3 space-y-2">
                        {entry.requestBody && (
                          <div>
                            <p className="text-xs font-bold text-gray-500 mb-1">Request Body</p>
                            <pre className="text-xs bg-white border rounded p-2 overflow-x-auto max-h-48">
                              {JSON.stringify(entry.requestBody, null, 2)}
                            </pre>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-gray-500 mb-1">Response Body</p>
                          <pre className="text-xs bg-white border rounded p-2 overflow-x-auto max-h-48">
                            {JSON.stringify(entry.responseBody, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
