import createClient from "openapi-fetch";
import type { paths } from "@/types/api";

const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const apiClient = createClient<paths>({
  baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to set authorization header dynamically
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.use({
      onRequest({ request }) {
        request.headers.set("Authorization", `Bearer ${token}`);
        return request;
      },
    });
  }
}
