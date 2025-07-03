
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import FarmerDashboard from '@/components/dashboard/FarmerDashboard';

interface User {
  email: string;
  userType: 'admin' | 'farmer';
  name: string;
  id: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userType: 'admin' | 'farmer', userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (user.userType === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <FarmerDashboard onLogout={handleLogout} />;
};

export default Index;
