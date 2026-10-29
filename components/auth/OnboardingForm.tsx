import React from 'react';
import { Form, Input, InputNumber, Select, Segmented, Button, Alert } from 'antd';
import { INDIAN_STATES, DISTRICTS_BY_STATE } from '../constants/locations';

export interface OnboardingValues {
  village: string;
  taluka: string;
  district: string;
  state: string;
  landholdingSize?: number;
  farmerCategory: string;
}

interface OnboardingFormProps {
  loading: boolean;
  error?: string;
  initialValues?: Partial<OnboardingValues>;
  onSubmit: (values: OnboardingValues) => void | Promise<void>;
  onSkip?: () => void;
  submitLabel?: string;
}

/**
 * Village/taluka/state/district/landholding/category fields shared by the
 * onboarding step inside AuthModal and the standalone Onboarding page — both
 * previously kept separate copies of this form backed by different (and
 * differently-sized) state/district datasets.
 */
const OnboardingForm: React.FC<OnboardingFormProps> = ({ loading, error, initialValues, onSubmit, onSkip, submitLabel = 'Save & Continue' }) => {
  const [form] = Form.useForm<OnboardingValues>();
  const state = Form.useWatch('state', form);
  const districts = state ? DISTRICTS_BY_STATE[state] || [] : [];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ farmerCategory: 'SMALL', ...initialValues }}
      onFinish={onSubmit}
      requiredMark={false}
    >
      {error && <Alert type="error" showIcon message={error} className="mb-4" />}

      <Form.Item name="village" label="Village">
        <Input placeholder="Enter your village name" />
      </Form.Item>

      <Form.Item name="taluka" label="Taluka">
        <Input placeholder="Enter your taluka" />
      </Form.Item>

      <Form.Item name="state" label="State" rules={[{ required: true, message: 'Please select your state' }]}>
        <Select
          showSearch
          placeholder="Select state"
          options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
          onChange={() => form.setFieldValue('district', undefined)}
        />
      </Form.Item>

      <Form.Item name="district" label="District" rules={[{ required: true, message: 'Please select your district' }]}>
        <Select
          showSearch
          placeholder={state ? 'Select district' : 'Select state first'}
          disabled={!state}
          options={districts.map((d) => ({ value: d, label: d }))}
        />
      </Form.Item>

      <Form.Item name="landholdingSize" label="Landholding (acres)">
        <InputNumber min={0} step={0.5} placeholder="e.g., 3.5" className="w-full" />
      </Form.Item>

      <Form.Item name="farmerCategory" label="Farmer Category">
        <Segmented
          block
          options={[
            { label: 'Marginal', value: 'MARGINAL' },
            { label: 'Small', value: 'SMALL' },
            { label: 'Large', value: 'LARGE' },
          ]}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" block size="large" loading={loading}>
        {submitLabel}
      </Button>
      {onSkip && (
        <Button type="link" block onClick={onSkip} className="!text-gray-400 !font-medium mt-1">
          Skip for now
        </Button>
      )}
    </Form>
  );
};

export default OnboardingForm;
