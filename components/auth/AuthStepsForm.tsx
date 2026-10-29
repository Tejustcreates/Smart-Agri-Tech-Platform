import React, { useEffect } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import type { useAuthFlow } from '../../hooks/useAuthFlow';

interface AuthStepsFormProps {
  flow: ReturnType<typeof useAuthFlow>;
  onLoginSuccess: (user: any) => void;
  onSignupAccountCreated: (user: any) => void;
}

/**
 * The mobile -> OTP -> signup-details step machine shared by AuthModal and AuthPage.
 * Validation lives in antd Form `rules` (per-field messages) instead of the old
 * pattern of one generic error string rendered above the form.
 */
const AuthStepsForm: React.FC<AuthStepsFormProps> = ({ flow, onLoginSuccess, onSignupAccountCreated }) => {
  const [mobileForm] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [signupForm] = Form.useForm();

  useEffect(() => {
    if (flow.step === 'mobile') { otpForm.resetFields(); }
  }, [flow.step, otpForm]);

  return (
    <>
      {flow.error && <Alert type="error" showIcon message={flow.error} className="mb-4" />}

      {flow.step === 'mobile' && (
        <Form
          form={mobileForm}
          layout="vertical"
          onFinish={(values) => flow.sendOtp(values.mobile)}
          requiredMark={false}
        >
          <Form.Item
            name="mobile"
            label="Mobile Number"
            rules={[
              { required: true, message: 'Please enter your mobile number' },
              { pattern: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
            ]}
          >
            <Input
              addonBefore="+91"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              autoFocus
              onChange={(e) => mobileForm.setFieldValue('mobile', e.target.value.replace(/\D/g, ''))}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={flow.loading}>
            Send OTP
          </Button>
          {flow.mode === 'login' && (
            <p className="mt-5 text-center text-sm text-gray-500">
              New to GrowSmart?{' '}
              <button
                type="button"
                onClick={() => flow.setMode('signup')}
                className="text-brand-600 font-semibold hover:underline"
              >
                Create new account
              </button>
            </p>
          )}
        </Form>
      )}

      {flow.step === 'otp' && (
        <Form
          form={otpForm}
          layout="vertical"
          onFinish={async (values) => {
            const user = await flow.verifyOtp(values.otp);
            if (user) onLoginSuccess(user);
          }}
          requiredMark={false}
        >
          <Form.Item
            name="otp"
            label="Enter OTP"
            rules={[
              { required: true, message: 'Please enter the OTP' },
              { pattern: /^\d{6}$/, message: 'Enter the 6-digit OTP' },
            ]}
          >
            <Input
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit OTP"
              autoFocus
              className="text-center tracking-[0.3em] text-lg font-bold"
              onChange={(e) => otpForm.setFieldValue('otp', e.target.value.replace(/\D/g, ''))}
            />
          </Form.Item>
          <p className="-mt-2 mb-4 text-xs text-gray-500">
            OTP sent to +91 {flow.mobileNumber}{' '}
            <button type="button" onClick={flow.changeNumber} className="text-brand-600 font-medium hover:underline">
              Change
            </button>
          </p>
          <Button type="primary" htmlType="submit" block size="large" loading={flow.loading}>
            Verify OTP
          </Button>
          <Button
            type="link"
            block
            onClick={() => { flow.resendOtp().catch(() => {}); }}
            loading={flow.loading}
            className="!text-brand-600 !font-medium"
          >
            Resend OTP
          </Button>
        </Form>
      )}

      {flow.step === 'signup' && (
        <Form
          form={signupForm}
          layout="vertical"
          onFinish={async (values) => {
            const user = await flow.createAccount(values);
            if (user) onSignupAccountCreated(user);
          }}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, min: 2, message: 'Please enter your full name' }]}
          >
            <Input placeholder="Enter your full name" autoFocus />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={flow.loading}>
            Create Account
          </Button>
        </Form>
      )}
    </>
  );
};

export default AuthStepsForm;
