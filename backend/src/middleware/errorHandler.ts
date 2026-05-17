import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/lead';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Internal Server Error';

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors: Record<string, string> = {};
    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
      errors
    });
    return;
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
      errors: { [field]: `${field} already exists` }
    });
    return;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(403).json({
      success: false,
      statusCode: 403,
      message: 'Invalid token'
    });
    return;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
};
