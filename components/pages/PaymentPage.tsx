import React from 'react';
import { useNavigate } from 'react-router-dom';
import Payment from '../Payment';

interface PaymentPageProps {
  total: number;
  onPaymentSuccess: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ total, onPaymentSuccess }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Payment
        total={total}
        onPaymentSuccess={onPaymentSuccess}
        onBackToCart={() => navigate('/cart')}
      />
    </div>
  );
};

export default PaymentPage;
