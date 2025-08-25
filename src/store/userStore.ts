import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  totalPointsEarned: number;
  currentSpendablePoints: number;
  currentLevel: number;
  levelProgress: number;
  certificatesEarned: string[];
  gamesPlayed: number;
  bestScores: Record<string, number>;
  achievements: Achievement[];
  joinDate: string;
  lastActive: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  icon: string;
}

export interface GameSession {
  gameType: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completionTime: number;
  completedAt: string;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: User) => void;
  updateUserProgress: (points: number, gameSession: GameSession) => void;
  addAchievement: (achievement: Achievement) => void;
  spendPoints: (amount: number) => boolean;
  logout: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,

  setCurrentUser: (user: User) => {
    set({ currentUser: user, isAuthenticated: true });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('aquasnap_user', JSON.stringify(user));
      }
    } catch (error) {
      console.warn('Failed to save user to localStorage:', error);
    }
  },

  updateUserProgress: (points: number, gameSession: GameSession) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const newTotalPointsEarned = currentUser.totalPointsEarned + points;
    const newCurrentSpendablePoints = currentUser.currentSpendablePoints + points;
    const newLevel = Math.floor(newTotalPointsEarned / 1000) + 1;
    const levelProgress = (newTotalPointsEarned % 1000) / 1000;

    // Check for level-based achievements
    const achievements = [...currentUser.achievements];
    const newAchievements: Achievement[] = [];

    if (newLevel > currentUser.currentLevel) {
      newAchievements.push({
        id: `level_${newLevel}`,
        name: `Level ${newLevel} Marine Expert`,
        description: `Reached Level ${newLevel}!`,
        unlockedAt: new Date().toISOString(),
        icon: '🌊'
      });
    }

    // Check for certificates
    const certificatesEarned = [...currentUser.certificatesEarned];
    if (newLevel >= 5 && !certificatesEarned.includes('enthusiast')) {
      certificatesEarned.push('enthusiast');
      newAchievements.push({
        id: 'marine_enthusiast',
        name: 'Marine Species Enthusiast',
        description: 'Earned your Marine Species Enthusiast certificate!',
        unlockedAt: new Date().toISOString(),
        icon: '🏆'
      });
    }

    if (newLevel >= 10 && !certificatesEarned.includes('expert')) {
      certificatesEarned.push('expert');
      newAchievements.push({
        id: 'marine_expert',
        name: 'Marine Species Expert',
        description: 'Earned your Marine Species Expert certificate!',
        unlockedAt: new Date().toISOString(),
        icon: '🥇'
      });
    }

    const updatedUser: User = {
      ...currentUser,
      totalPointsEarned: newTotalPointsEarned,
      currentSpendablePoints: newCurrentSpendablePoints,
      currentLevel: newLevel,
      levelProgress,
      certificatesEarned,
      gamesPlayed: currentUser.gamesPlayed + 1,
      bestScores: {
        ...currentUser.bestScores,
        [gameSession.gameType]: Math.max(
          currentUser.bestScores[gameSession.gameType] || 0,
          gameSession.score
        )
      },
      achievements: [...achievements, ...newAchievements],
      lastActive: new Date().toISOString()
    };

    set({ currentUser: updatedUser });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('aquasnap_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.warn('Failed to save user progress to localStorage:', error);
    }

    // Show achievement notifications
    newAchievements.forEach(achievement => {
      setTimeout(() => {
        alert(`🎉 Achievement Unlocked: ${achievement.name}!`);
      }, 500);
    });
  },

  addAchievement: (achievement: Achievement) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updatedUser: User = {
      ...currentUser,
      achievements: [...currentUser.achievements, achievement]
    };

    set({ currentUser: updatedUser });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('aquasnap_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.warn('Failed to save achievement to localStorage:', error);
    }
  },

  spendPoints: (amount: number) => {
    const { currentUser } = get();
    if (!currentUser || currentUser.currentSpendablePoints < amount) {
      console.log('Cannot spend points:', { available: currentUser?.currentSpendablePoints, needed: amount });
      return false;
    }

    const updatedUser: User = {
      ...currentUser,
      currentSpendablePoints: currentUser.currentSpendablePoints - amount,
      lastActive: new Date().toISOString()
    };

    set({ currentUser: updatedUser });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('aquasnap_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.warn('Failed to save point spending to localStorage:', error);
    }
    console.log('Points spent successfully:', { spent: amount, remaining: updatedUser.currentSpendablePoints });
    return true;
  },

  logout: () => {
    set({ currentUser: null, isAuthenticated: false });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('aquasnap_user');
      }
    } catch (error) {
      console.warn('Failed to remove user from localStorage:', error);
    }
  }
}));