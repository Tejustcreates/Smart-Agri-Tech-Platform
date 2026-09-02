import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import prisma from '../config/database';

export interface AuthUser {
  id: string;
  role: string;
  mobileNumber: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// Middleware: require valid JWT access token
export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required', code: 'AUTH_REQUIRED' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    } else {
      res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
    }
  }
}

// Middleware: require specific roles
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required', code: 'AUTH_REQUIRED' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions', code: 'FORBIDDEN' });
      return;
    }
    next();
  };
}

// Optional auth — sets req.user if token present but doesn't block
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
}

// Generate access token
export function generateAccessToken(user: { id: string; role: string; mobileNumber: string }): string {
  return jwt.sign(
    { id: user.id, role: user.role, mobileNumber: user.mobileNumber },
    env.JWT_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'] }
  );
}

// Generate refresh token
export function generateRefreshToken(): string {
  return jwt.sign(
    { type: 'refresh', jti: uuidv4() },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'] } as jwt.SignOptions
  );
}

// Hash a refresh token for storage
export async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10);
}

// Verify refresh token hash
export async function verifyTokenHash(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}
