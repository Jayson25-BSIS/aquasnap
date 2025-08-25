'use client';

import React, { JSX, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/store/userStore';
import type { User } from '@/store/userStore';

export function AuthScreen(): JSX.Element {
    
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const { setCurrentUser } = useUserStore();

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get stored users from localStorage (with browser check)
      let storedUsers = [];
      if (typeof window !== 'undefined' && window.localStorage) {
        storedUsers = JSON.parse(localStorage.getItem('aquasnap_users') || '[]');
      }
      const user = storedUsers.find((u: User) => u.username === loginData.username);

      if (user && user.username === loginData.username) {
        // Update last active
        user.lastActive = new Date().toISOString();
        
        // Update stored users (with browser check)
        const updatedUsers = storedUsers.map((u: User) => 
          u.id === user.id ? user : u
        );
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('aquasnap_users', JSON.stringify(updatedUsers));
        }
        
        setCurrentUser(user);
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (signupData.password.length < 4) {
      setError('Password must be at least 4 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if username already exists (with browser check)
      let storedUsers = [];
      if (typeof window !== 'undefined' && window.localStorage) {
        storedUsers = JSON.parse(localStorage.getItem('aquasnap_users') || '[]');
      }
      const existingUser = storedUsers.find((u: User) => u.username === signupData.username);

      if (existingUser) {
        setError('Username already exists');
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: signupData.username,
        totalPointsEarned: 0,
        currentSpendablePoints: 0,
        currentLevel: 1,
        levelProgress: 0,
        certificatesEarned: [],
        gamesPlayed: 0,
        bestScores: {},
        achievements: [{
          id: 'welcome',
          name: 'Welcome to AQUASNAP!',
          description: 'Started your marine learning journey',
          unlockedAt: new Date().toISOString(),
          icon: '🌊'
        }],
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      // Store user (with browser check)
      const updatedUsers = [...storedUsers, newUser];
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('aquasnap_users', JSON.stringify(updatedUsers));
      }
      
      setCurrentUser(newUser);
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl">
              🐠
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            AQUASNAP
          </CardTitle>
          <CardDescription className="text-gray-600">
            Discover the wonders of marine life through gamified learning
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={loginData.username}
                    onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>
                
                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="Choose a username"
                    value={signupData.username}
                    onChange={(e) => setSignupData(prev => ({ ...prev, username: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    className="w-full"
                  />
                </div>
                
                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>🌊 Join thousands of marine enthusiasts worldwide!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}