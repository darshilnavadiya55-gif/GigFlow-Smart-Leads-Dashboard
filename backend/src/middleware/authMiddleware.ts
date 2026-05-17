import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JwtPayload } from '../types/auth';

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'No authentication token provided'
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_secret_key'
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      statusCode: 403,
      message: 'Invalid or expired token'
    });
  }
};

export const roleMiddleware = (requiredRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'User not authenticated'
      });
      return;
    }

    if (!requiredRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Insufficient permissions for this action'
      });
      return;
    }

    next();
  };
};
