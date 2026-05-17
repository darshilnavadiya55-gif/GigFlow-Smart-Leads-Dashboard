import { Request, Response, NextFunction } from 'express';
import { RegisterRequest, LoginRequest } from '../types/auth';
import { AuthService } from '../services/authService';

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await AuthService.register(req.body as RegisterRequest);
      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await AuthService.login(req.body as LoginRequest);
      res.status(result.statusCode).json(result);
    } catch (error) {
      next(error);
    }
  }
}
