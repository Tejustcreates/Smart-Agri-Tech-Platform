import { env } from '../config/env';

type SmsProvider = 'fast2sms' | 'twilio' | 'msg91' | 'console';

interface SmsSendResult {
  provider: SmsProvider;
  messageId?: string;
}

function normaliseMobile(mobileNumber: string): string {
  return mobileNumber.replace(/\D/g, '').slice(-10);
}

function toE164(mobileNumber: string): string {
  return `+91${normaliseMobile(mobileNumber)}`;
}

function resolveProvider(): SmsProvider {
  const configured = env.SMS_PROVIDER.trim().toLowerCase();
  if (configured === 'fast2sms' || configured === 'twilio' || configured === 'msg91' || configured === 'console') {
    return configured;
  }

  if (env.FAST2SMS_API_KEY) return 'fast2sms';
  if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER) return 'twilio';
  if (env.MSG91_AUTH_KEY && env.MSG91_TEMPLATE_ID) return 'msg91';
  return 'console';
}

async function sendViaFast2Sms(mobileNumber: string, otp: string): Promise<SmsSendResult> {
  if (!env.FAST2SMS_API_KEY) throw new Error('FAST2SMS_API_KEY is not configured');

  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      authorization: env.FAST2SMS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      route: 'otp',
      variables_values: otp,
      numbers: normaliseMobile(mobileNumber),
      flash: 0,
    }),
  });

  const data = await response.json().catch(() => ({})) as any;
  if (!response.ok || data.return === false) {
    throw new Error(data.message || `Fast2SMS request failed (${response.status})`);
  }

  return { provider: 'fast2sms', messageId: data.request_id };
}

async function sendViaTwilio(mobileNumber: string, otp: string): Promise<SmsSendResult> {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_NUMBER) {
    throw new Error('Twilio credentials are not fully configured');
  }

  const body = new URLSearchParams({
    To: toE164(mobileNumber),
    From: env.TWILIO_FROM_NUMBER,
    Body: `Your GrowSmart OTP is ${otp}. It is valid for ${env.OTP_EXPIRY_MINUTES} minutes. Do not share this code with anyone.`,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    }
  );

  const data = await response.json().catch(() => ({})) as any;
  if (!response.ok) {
    throw new Error(data.message || `Twilio request failed (${response.status})`);
  }

  return { provider: 'twilio', messageId: data.sid };
}

async function sendViaMsg91(mobileNumber: string, otp: string): Promise<SmsSendResult> {
  if (!env.MSG91_AUTH_KEY || !env.MSG91_TEMPLATE_ID) {
    throw new Error('MSG91 auth key/template id are not configured');
  }

  const response = await fetch('https://control.msg91.com/api/v5/otp', {
    method: 'POST',
    headers: {
      authkey: env.MSG91_AUTH_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template_id: env.MSG91_TEMPLATE_ID,
      mobile: `91${normaliseMobile(mobileNumber)}`,
      otp,
    }),
  });

  const data = await response.json().catch(() => ({})) as any;
  if (!response.ok || data.type === 'error') {
    throw new Error(data.message || `MSG91 request failed (${response.status})`);
  }

  return { provider: 'msg91', messageId: data.request_id || data.message };
}

export async function sendOtpSms(mobileNumber: string, otp: string): Promise<SmsSendResult> {
  const provider = resolveProvider();

  if (provider === 'console') {
    if (env.NODE_ENV === 'production') {
      throw new Error('No SMS provider configured. Set FAST2SMS_API_KEY, Twilio credentials, or MSG91 credentials.');
    }

    console.log(`\n╔══════════════════════════════════════════╗`);
    console.log(`║  OTP for ${mobileNumber}: ${otp}`);
    console.log(`║  (Console fallback — add SMS provider keys to send real SMS)`);
    console.log(`╚══════════════════════════════════════════╝\n`);
    return { provider: 'console' };
  }

  switch (provider) {
    case 'fast2sms':
      return sendViaFast2Sms(mobileNumber, otp);
    case 'twilio':
      return sendViaTwilio(mobileNumber, otp);
    case 'msg91':
      return sendViaMsg91(mobileNumber, otp);
    default:
      throw new Error(`Unsupported SMS provider: ${provider}`);
  }
}
