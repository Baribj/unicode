import {
  ApiResponseSuccessMessage,
  ApiSuccessResponse,
} from "@/schema/ApiResponse";

export default function getSuccessResponse(
  message: ApiResponseSuccessMessage = {},
  data: any = {}
): ApiSuccessResponse {
  return {
    success: true,
    message: {
      title: message.title ? message.title : "Success",
      detail: message.detail ? message.detail : "Operation was successful",
    },
    result: data,
  };
}
