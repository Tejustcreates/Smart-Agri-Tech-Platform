import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { sendOtpSms } from './sms';

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

  await sendOtpSms(mobileNumber, otp);

  return { otp, otpHash };
}

export async function verifyOtp(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}
