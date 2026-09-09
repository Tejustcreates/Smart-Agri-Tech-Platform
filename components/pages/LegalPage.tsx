import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Typography } from 'antd';
import { ArrowLeft } from 'lucide-react';

const { Title, Paragraph } = Typography;

const LEGAL_CONTENT: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'GrowSmart collects only the information needed to provide farm advisory, mandi price, weather, and equipment-rental features: your mobile number for OTP login, and location/crop details you choose to share for personalized recommendations.',
      'We do not sell farmer data to third parties. Data shared with government scheme or mandi partner APIs is limited to what is required to fulfil the specific feature you use.',
      'You can request deletion of your account and associated data at any time by contacting support through the Kisan Call Center helpline listed in the footer.',
    ],
  },
  terms: {
    title: 'Terms of Use',
    body: [
      'GrowSmart is provided free of charge to help Indian farmers make informed decisions. Crop, weather, and disease recommendations are advisory in nature and do not replace guidance from a certified agronomist or your local Krishi Vigyan Kendra.',
      'Mandi prices and equipment listings are sourced from third-party and community data and may not reflect real-time accuracy; always confirm rates directly with the APMC or equipment owner before transacting.',
      'By using GrowSmart you agree not to misuse the platform (e.g. submitting false equipment listings or scheme information).',
    ],
  },
  guidelines: {
    title: 'Farmer Guidelines',
    body: [
      'When listing equipment for rent, provide accurate condition, pricing, and availability so other farmers can trust the listing.',
      'When reporting crop disease symptoms, include clear photos and honest symptom descriptions for the most accurate diagnosis.',
      'Report suspicious mandi prices, scheme information, or equipment listings using the Kisan Call Center helpline so we can keep the platform trustworthy for everyone.',
    ],
  },
};

const LegalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const content = slug ? LEGAL_CONTENT[slug] : undefined;

  if (!content) return <Navigate to="/" replace />;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-brand-700 hover:text-brand-800 font-semibold mb-6">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <Title level={2}>{content.title}</Title>
        {content.body.map((paragraph, i) => (
          <Paragraph key={i} className="text-gray-600">{paragraph}</Paragraph>
        ))}
      </div>
    </section>
  );
};

export default LegalPage;
