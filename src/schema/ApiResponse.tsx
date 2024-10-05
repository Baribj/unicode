export interface ApiResponseSuccessMessage {
  title?: string;
  detail?: string;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  message: ApiResponseSuccessMessage;
  result: T;
}

export interface ApiResponseErrorObject {
  title?: string;
  detail?: string;
}

export interface ApiFailResponse<T = ApiResponseErrorObject[]> {
  success: false;
  errors: T;
}
