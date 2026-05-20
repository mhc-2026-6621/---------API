export interface ApiCallEntry {
  id: string;
  apiName: string;
  method: "GET" | "POST" | "PATCH";
  endpoint: string;
  requestBody?: Record<string, unknown>;
  responseBody: Record<string, unknown>;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
}
