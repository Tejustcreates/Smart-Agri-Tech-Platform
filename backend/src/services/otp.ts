import bcrypt from 'bcryptjs';
import { env } from '../config/env';

// ─── MOCK OTP SERVICE ───────────────────────────────────────
// In production, replace this with Twilio/MSG91 integration.
// The OTP is logged to console for local development.

export interface OtpResult {
  otp: string;
  otpHash: string;
}

/**
 * Generate a numeric OTP, hash it, and return both.
 * In production: send the OTP via SMS provider, only store the hash.
 */
export async function generateOtp(mobileNumber: string): Promise<OtpResult> {
  const length = env.OTP_LENGTH;
  const otp = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  const otpHash = await bcrypt.hash(otp, 10);

  // MOCK: In production, send SMS here
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║  OTP for ${mobileNumber}: ${otp}`);
  console.log(`║  (Mock SMS — in production, this goes via Twilio/MSG91)`);
  console.log(`╚══════════════════════════════════════════╝\n`);

  return { otp, otpHash };
}

export async function verifyOtp(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}
