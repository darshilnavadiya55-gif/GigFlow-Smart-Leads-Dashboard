export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string>;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
