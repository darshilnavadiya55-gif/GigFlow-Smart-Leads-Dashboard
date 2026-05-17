export interface IUser {
  _id: string;
  email: string;
  password: string; // hashed
  role: 'admin' | 'sales_user';
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    user: Omit<IUser, 'password'>;
    token: string;
  };
  errors?: Record<string, string>;
}

import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'admin' | 'sales_user';
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
