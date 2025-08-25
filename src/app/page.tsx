'use client';

import { useState, useEffect, JSX } from 'react';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { GameLibrary } from '@/components/games/GameLibrary';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { FishTank } from '@/components/FishTank';
import { MarineLearningHub } from '@/components/MarineLearningHub';
import { SDGPurpose } from '@/components/SDGPurpose';
import { Footer } from '@/components/Footer';
import { useUserStore } from '@/store/userStore';

export default function AquaSnapApp(): JSX.Element {
  const { currentUser, isAuthenticated } = useUserStore();
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'games' | 'profile' | 'fishtank' | 'learning' | 'purpose'>('dashboard');
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    // Simple client-side initialization
    setIsClient(true);
    
    // Check for existing user session with comprehensive error handling
    const initializeUser = () => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const storedUser = localStorage.getItem('aquasnap_user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            useUserStore.getState().setCurrentUser(user);
          }
        }
      } catch (error) {
        console.warn('Failed to load stored user data:', error);
      }
    };

    initializeUser();
  }, []);

  // Show loading state until client is ready
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse">
            🐠
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AQUASNAP</h1>
          <p className="text-gray-600">Loading marine adventure...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const renderCurrentScreen = (): JSX.Element => {
    switch (currentScreen) {
      case 'games':
        return <GameLibrary onBack={() => setCurrentScreen('dashboard')} />;
      case 'profile':
        return <ProfileScreen onBack={() => setCurrentScreen('dashboard')} />;
      case 'fishtank':
        return <FishTank onExit={() => setCurrentScreen('dashboard')} />;
      case 'learning':
        return <MarineLearningHub onBack={() => setCurrentScreen('dashboard')} />;
      case 'purpose':
        return (
          <div>
            <div className="p-4">
              <button 
                onClick={() => setCurrentScreen('dashboard')} 
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Dashboard
              </button>
            </div>
            <SDGPurpose />
            <Footer />
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {renderCurrentScreen()}
      {currentScreen !== 'purpose' && <Footer />}
    </div>
  );
}