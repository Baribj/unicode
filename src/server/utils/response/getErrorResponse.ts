import { ApiFailResponse } from "@/schema/ApiResponse";

export interface ApiResponseErrorObject {
  title?: string;
  detail?: string;
}

export default function getErrorResponse(
  error?: ApiResponseErrorObject
): ApiFailResponse {
  return {
    success: false,
    errors: [
      {
        title: error?.title || "Error",
        detail: error?.detail || "An unexpected error occurred",
      },
    ],
  };
}
