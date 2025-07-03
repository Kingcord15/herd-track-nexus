
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Users, Mail, UserPlus } from 'lucide-react';

interface LoginFormProps {
  onLogin: (userType: 'admin' | 'farmer', userData: any) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [userType, setUserType] = useState<'admin' | 'farmer'>('farmer');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login/registration validation
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isCreateAccount) {
      // Create account validation
      if (!email || !password || !confirmPassword || !fullName || (userType === 'farmer' && !farmName)) {
        toast({
          title: "Registration Failed",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Registration Failed",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const userData = {
        email,
        userType,
        name: fullName,
        farmName: userType === 'farmer' ? farmName : undefined,
        id: userType === 'admin' ? 'admin-new' : 'farmer-new'
      };
      
      onLogin(userType, userData);
      toast({
        title: "Account Created Successfully",
        description: `Welcome to HERD TRACK SYSTEM, ${fullName}!`,
      });
    } else {
      // Login validation
      if (email && password) {
        const userData = {
          email,
          userType,
          name: userType === 'admin' ? 'System Administrator' : 'John Farmer',
          id: userType === 'admin' ? 'admin-001' : 'farmer-001'
        };
        
        onLogin(userType, userData);
        toast({
          title: "Login Successful",
          description: `Welcome back to HERD TRACK SYSTEM, ${userData.name}!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Please enter valid credentials",
          variant: "destructive",
        });
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            {isCreateAccount ? <UserPlus className="w-8 h-8 text-white" /> : <Users className="w-8 h-8 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">HERD TRACK SYSTEM</CardTitle>
          <CardDescription>
            {isCreateAccount ? 'Create your account for cattle management' : 'Secure login for cattle management'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select value={userType} onValueChange={(value: 'admin' | 'farmer') => setUserType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">Farmer</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isCreateAccount && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {isCreateAccount && userType === 'farmer' && (
              <div className="space-y-2">
                <Label htmlFor="farmName">Farm Name</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="farmName"
                    type="text"
                    placeholder="Enter your farm name"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {isCreateAccount && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading 
                ? (isCreateAccount ? 'Creating Account...' : 'Signing in...') 
                : (isCreateAccount ? 'Create Account' : 'Sign In')
              }
            </Button>
            
            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setIsCreateAccount(!isCreateAccount)}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {isCreateAccount 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Create one"
                }
              </button>
              
              {!isCreateAccount && (
                <div className="text-sm text-gray-600">
                  <a href="#" className="hover:text-green-600">Forgot password?</a>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
