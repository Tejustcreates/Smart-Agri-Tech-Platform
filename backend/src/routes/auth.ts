import { Router, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import { env } from '../config/env';
import { validate } from '../middleware/validate';
import { generateOtp, verifyOtp } from '../services/otp';
import { AuthRequest, generateAccessToken, generateRefreshToken, hashToken, verifyTokenHash, authenticate } from '../middleware/auth';

const router = Router();

// ─── Schemas ────────────────────────────────────────────────

const requestOtpSchema = z.object({
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  purpose: z.enum(['LOGIN', 'SIGNUP']).default('LOGIN'),
});

const verifyOtpSchema = z.object({
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/),
  otp: z.string().length(6),
  purpose: z.enum(['LOGIN', 'SIGNUP']).default('LOGIN'),
});

const signupSchema = z.object({
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/),
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  preferredLanguage: z.enum(['en', 'hi', 'mr']).default('en'),
  village: z.string().optional(),
  taluka: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  landholdingSize: z.number().positive().optional(),
  farmerCategory: z.enum(['SMALL', 'MARGINAL', 'LARGE']).optional(),
});

const pinLoginSchema = z.object({
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/),
  pin: z.string().length(4),
});

const setPinSchema = z.object({
  pin: z.string().length(4),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// ─── Request OTP ────────────────────────────────────────────

router.post('/request-otp', validate(requestOtpSchema), async (req, res: Response) => {
  const { mobileNumber, purpose } = req.body;

  // Check if user exists for LOGIN
  if (purpose === 'LOGIN') {
    const user = await prisma.user.findUnique({ where: { mobileNumber } });
    if (!user) {
      // Don't reveal whether user exists — return success anyway
      // but don't actually send OTP
      res.json({ message: 'If this number is registered, you will receive an OTP' });
      return;
    }
  }

  // Check rate limiting — max 3 OTPs per number in 10 minutes
  const recentOtps = await prisma.otpRequest.count({
    where: {
      mobileNumber,
      createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
    },
  });

  if (recentOtps >= 3) {
    res.status(429).json({ error: 'Too many OTP requests. Please try again later.', code: 'RATE_LIMITED' });
    return;
  }

  const { otp, otpHash } = await generateOtp(mobileNumber);

  // Invalidate previous unverified OTPs for this number
  await prisma.otpRequest.updateMany({
    where: { mobileNumber, purpose, isVerified: false },
    data: { isVerified: true },
  });

  // Store OTP
  await prisma.otpRequest.create({
    data: {
      mobileNumber,
      otpHash,
      purpose,
      expiresAt: new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000),
    },
  });

  res.json({ message: 'OTP sent successfully', expiresIn: env.OTP_EXPIRY_MINUTES * 60 });
});

// ─── Verify OTP ─────────────────────────────────────────────

router.post('/verify-otp', validate(verifyOtpSchema), async (req, res: Response) => {
  const { mobileNumber, otp, purpose } = req.body;

  const otpRequest = await prisma.otpRequest.findFirst({
    where: {
      mobileNumber,
      purpose,
      isVerified: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRequest) {
    res.status(400).json({ error: 'OTP expired or not found', code: 'OTP_INVALID' });
    return;
  }

  if (otpRequest.attempts >= otpRequest.maxAttempts) {
    res.status(429).json({ error: 'Too many attempts. Request a new OTP.', code: 'OTP_MAX_ATTEMPTS' });
    return;
  }

  // Increment attempts
  await prisma.otpRequest.update({
    where: { id: otpRequest.id },
    data: { attempts: { increment: 1 } },
  });

  const isValid = await verifyOtp(otp, otpRequest.otpHash);
  if (!isValid) {
    res.status(400).json({ error: 'Invalid OTP', code: 'OTP_INCORRECT' });
    return;
  }

  // Mark OTP as verified
  await prisma.otpRequest.update({
    where: { id: otpRequest.id },
    data: { isVerified: true, verifiedAt: new Date() },
  });

  if (purpose === 'LOGIN') {
    const user = await prisma.user.findUnique({ where: { mobileNumber } });
    if (!user) {
      res.status(404).json({ error: 'User not found. Please sign up first.', code: 'USER_NOT_FOUND' });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: user.id, role: user.role, mobileNumber: user.mobileNumber });
    const refreshToken = generateRefreshToken();
    const refreshHash = await hashToken(refreshToken);

    // Store session
    await prisma.authSession.create({
      data: {
        userId: user.id,
        refreshTokenHash: refreshHash,
        deviceInfo: req.headers['user-agent'] || null,
        ipAddress: req.ip || null,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        mobileNumber: user.mobileNumber,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        isOnboarded: user.isOnboarded,
        district: user.district,
        state: user.state,
      },
      accessToken,
      refreshToken,
    });
  } else {
    // SIGNUP purpose — return verification token for next step
    res.json({ message: 'OTP verified', verified: true });
  }
});

// ─── Signup (after OTP verification) ────────────────────────

router.post('/signup', validate(signupSchema), async (req, res: Response) => {
  const { mobileNumber, ...data } = req.body;

  const existing = await prisma.user.findUnique({ where: { mobileNumber } });
  if (existing) {
    res.status(409).json({ error: 'User already exists with this mobile number', code: 'USER_EXISTS' });
    return;
  }

  // Hash password if provided
  const userData: any = {
    mobileNumber,
    name: data.name,
    email: data.email,
    preferredLanguage: data.preferredLanguage,
    village: data.village,
    taluka: data.taluka,
    district: data.district,
    state: data.state,
    landholdingSize: data.landholdingSize,
    farmerCategory: data.farmerCategory,
    isOnboarded: !!(data.village && data.district && data.state),
  };

  if (data.password) {
    userData.passwordHash = await bcrypt.hash(data.password, 12);
  }

  const user = await prisma.user.create({ data: userData });

  // Generate tokens
  const accessToken = generateAccessToken({ id: user.id, role: user.role, mobileNumber: user.mobileNumber });
  const refreshToken = generateRefreshToken();
  const refreshHash = await hashToken(refreshToken);

  await prisma.authSession.create({
    data: {
      userId: user.id,
      refreshTokenHash: refreshHash,
      deviceInfo: req.headers['user-agent'] || null,
      ipAddress: req.ip || null,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  res.status(201).json({
    message: 'Account created successfully',
    user: {
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      isOnboarded: user.isOnboarded,
    },
    accessToken,
    refreshToken,
  });
});

// ─── PIN Login ──────────────────────────────────────────────

router.post('/pin-login', validate(pinLoginSchema), async (req, res: Response) => {
  const { mobileNumber, pin } = req.body;

  const user = await prisma.user.findUnique({ where: { mobileNumber } });
  if (!user || !user.pinHash) {
    res.status(401).json({ error: 'PIN login not available for this account', code: 'PIN_NOT_SET' });
    return;
  }

  const isValid = await bcrypt.compare(pin, user.pinHash);
  if (!isValid) {
    res.status(401).json({ error: 'Invalid PIN', code: 'PIN_INCORRECT' });
    return;
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role, mobileNumber: user.mobileNumber });
  const refreshToken = generateRefreshToken();
  const refreshHash = await hashToken(refreshToken);

  await prisma.authSession.create({
    data: {
      userId: user.id,
      refreshTokenHash: refreshHash,
      deviceInfo: req.headers['user-agent'] || null,
      ipAddress: req.ip || null,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  res.json({
    message: 'PIN login successful',
    user: {
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      isOnboarded: user.isOnboarded,
    },
    accessToken,
    refreshToken,
  });
});

// ─── Set PIN ────────────────────────────────────────────────

router.post('/set-pin', authenticate, validate(setPinSchema), async (req: AuthRequest, res: Response) => {
  const { pin } = req.body;
  const pinHash = await bcrypt.hash(pin, 10);

  await prisma.user.update({
    where: { id: req.user!.id },
    data: { pinHash },
  });

  res.json({ message: 'PIN set successfully' });
});

// ─── Refresh Token ──────────────────────────────────────────

router.post('/refresh', validate(refreshTokenSchema), async (req, res: Response) => {
  const { refreshToken } = req.body;

  // Find session with this token
  const sessions = await prisma.authSession.findMany({
    where: {
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
  });

  let matchedSession = null;
  for (const session of sessions) {
    const match = await verifyTokenHash(refreshToken, session.refreshTokenHash);
    if (match) {
      matchedSession = session;
      break;
    }
  }

  if (!matchedSession) {
    res.status(401).json({ error: 'Invalid refresh token', code: 'INVALID_REFRESH' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: matchedSession.userId } });
  if (!user || !user.isActive) {
    res.status(401).json({ error: 'Account deactivated', code: 'ACCOUNT_INACTIVE' });
    return;
  }

  // Rotate refresh token (invalidate old, issue new)
  await prisma.authSession.update({
    where: { id: matchedSession.id },
    data: { isRevoked: true },
  });

  const newAccessToken = generateAccessToken({ id: user.id, role: user.role, mobileNumber: user.mobileNumber });
  const newRefreshToken = generateRefreshToken();
  const newRefreshHash = await hashToken(newRefreshToken);

  await prisma.authSession.create({
    data: {
      userId: user.id,
      refreshTokenHash: newRefreshHash,
      deviceInfo: req.headers['user-agent'] || null,
      ipAddress: req.ip || null,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});

// ─── Logout ─────────────────────────────────────────────────

router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  // Revoke all sessions for this user
  await prisma.authSession.updateMany({
    where: { userId: req.user!.id, isRevoked: false },
    data: { isRevoked: true },
  });

  res.json({ message: 'Logged out successfully' });
});

// ─── Get Current User ───────────────────────────────────────

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true, name: true, mobileNumber: true, email: true, role: true,
      preferredLanguage: true, village: true, taluka: true, district: true,
      state: true, landholdingSize: true, farmerCategory: true,
      isOnboarded: true, createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ user });
});

// ─── Update Profile ─────────────────────────────────────────

router.put('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  const allowedFields = ['name', 'email', 'preferredLanguage', 'village', 'taluka', 'district', 'state', 'landholdingSize', 'farmerCategory'];
  const updates: any = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length > 0) {
    updates.isOnboarded = true;
  }

  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: updates,
    select: {
      id: true, name: true, mobileNumber: true, email: true, role: true,
      preferredLanguage: true, village: true, taluka: true, district: true,
      state: true, landholdingSize: true, farmerCategory: true, isOnboarded: true,
    },
  });

  res.json({ user });
});

export default router;
