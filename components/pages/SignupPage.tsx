import React from 'react';
import { useNavigate } from 'react-router-dom';
import Signup from '../Signup';

interface SignupPageProps {
  user: { name: string } | null;
  onSignup: (user: { name: string }) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ user, onSignup }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Signup onSignup={onSignup} onSwitchToLogin={() => navigate('/login')} />
    </div>
  );
};

export default SignupPage;
