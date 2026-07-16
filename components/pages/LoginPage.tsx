import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import Login from '../Login';

interface LoginPageProps {
  user: User | null;
  onLogin: (user: { name: string }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ user, onLogin }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Login onLogin={onLogin} onSwitchToSignup={() => navigate('/signup')} />
    </div>
  );
};

export default LoginPage;
