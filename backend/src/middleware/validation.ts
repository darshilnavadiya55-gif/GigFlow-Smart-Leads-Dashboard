import { Request, Response, NextFunction } from 'express';
import { RegisterRequest, LoginRequest } from '../types/auth';
import { CreateLeadRequest, UpdateLeadRequest } from '../types/lead';

export const validateEmail = (email: string): boolean => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain number');

  return { valid: errors.length === 0, errors };
};

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password, confirmPassword } = req.body as RegisterRequest;

  const errors: Record<string, string> = {};

  if (!email || !validateEmail(email)) {
    errors.email = 'Valid email is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.errors.join(', ');
    }
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
      errors
    });
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body as LoginRequest;

  const errors: Record<string, string> = {};

  if (!email || !validateEmail(email)) {
    errors.email = 'Valid email is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
      errors
    });
    return;
  }

  next();
};

export const validateCreateLead = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, status, source } = req.body as CreateLeadRequest;

  const errors: Record<string, string> = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!email || !validateEmail(email)) {
    errors.email = 'Valid email is required';
  }

  if (!status || !['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
    errors.status = 'Valid status is required';
  }

  if (!source || !['Website', 'Instagram', 'Referral'].includes(source)) {
    errors.source = 'Valid source is required';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
      errors
    });
    return;
  }

  next();
};
