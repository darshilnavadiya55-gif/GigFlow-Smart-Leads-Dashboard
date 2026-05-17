import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

export class AuthService {
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const { email, password } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        statusCode: 400,
        message: 'User already exists with this email',
        errors: { email: 'Email already registered' }
      };
    }

    // Determine role - strictly restrict admin role to admin@gmail.com
    const assignedRole = email.toLowerCase() === 'admin@gmail.com' ? 'admin' : 'sales_user';

    // Create new user
    const user = new User({
      email,
      password,
      role: assignedRole
    });

    await user.save();

    // Generate token
    const token = this.generateToken(user._id.toString(), user.email, user.role);

    return {
      success: true,
      statusCode: 201,
      message: 'Registration successful',
      data: {
        user: user.toJSON(),
        token
      }
    };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return {
        success: false,
        statusCode: 401,
        message: 'Invalid email or password',
        errors: { credentials: 'Invalid email or password' }
      };
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return {
        success: false,
        statusCode: 401,
        message: 'Invalid email or password',
        errors: { credentials: 'Invalid email or password' }
      };
    }

    // Generate token
    const token = this.generateToken(user._id.toString(), user.email, user.role);

    return {
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    };
  }

  private static generateToken(userId: string, email: string, role: string): string {
    return jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: (process.env.JWT_EXPIRE || '7d') as any }
    );
  }
}
