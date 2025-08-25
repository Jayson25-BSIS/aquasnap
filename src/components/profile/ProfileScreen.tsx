'use client';

import React, { JSX, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Trophy, Award, Star, Calendar, Download, Crown, Target, TrendingUp } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

interface ProfileScreenProps {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: ProfileScreenProps): JSX.Element {
  const { currentUser } = useUserStore();
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!currentUser) return <div>Loading...</div>;

  const progressPercentage = currentUser.levelProgress * 100;
  const joinDate = new Date(currentUser.joinDate);
  const lastActive = new Date(currentUser.lastActive);

  // Calculate statistics
  const totalGamesPlayed = currentUser.gamesPlayed;
  const accuracyPercentage = totalGamesPlayed > 0 
    ? Math.round((Object.values(currentUser.bestScores).reduce((sum, score) => sum + score, 0) / totalGamesPlayed) * 10) / 10
    : 0;

  // Recent achievements (last 5)
  const recentAchievements = currentUser.achievements
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 5);

  // Download certificate function
  const downloadCertificate = (certificateType: string): void => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#3B82F6');
    gradient.addColorStop(1, '#06B6D4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Certificate border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 760, 560);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 400, 100);

    // AQUASNAP logo
    ctx.font = 'bold 24px Arial';
    ctx.fillText('🐠 AQUASNAP 🐠', 400, 140);

    // Certificate type
    ctx.font = 'bold 32px Arial';
    const certTitle = certificateType === 'enthusiast' 
      ? 'Marine Species Enthusiast' 
      : 'Marine Species Expert';
    ctx.fillText(certTitle, 400, 220);

    // User info
    ctx.font = '24px Arial';
    ctx.fillText('This is to certify that', 400, 280);
    
    ctx.font = 'bold 36px Arial';
    ctx.fillText(currentUser.username, 400, 330);
    
    ctx.font = '20px Arial';
    ctx.fillText('has successfully demonstrated exceptional knowledge', 400, 380);
    ctx.fillText('of marine species and ocean conservation', 400, 410);

    // Achievement details
    ctx.font = '18px Arial';
    ctx.fillText(`Level ${currentUser.currentLevel} • ${currentUser.totalPoints.toLocaleString()} Points • ${currentUser.gamesPlayed} Games Completed`, 400, 460);

    // Date
    ctx.font = '16px Arial';
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    ctx.fillText(`Awarded on ${currentDate}`, 400, 520);

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentUser.username}-${certificateType}-certificate.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  };

  // Mock leaderboard data (in a real app, this would come from the database)
  const leaderboardData = [
    { username: currentUser.username, points: currentUser.totalPoints, level: currentUser.currentLevel, rank: 1 },
    { username: 'OceanExplorer', points: 8500, level: 9, rank: 2 },
    { username: 'MarineBiologist', points: 7200, level: 8, rank: 3 },
    { username: 'SeaLifeLover', points: 6800, level: 7, rank: 4 },
    { username: 'AquaStudent', points: 5900, level: 6, rank: 5 },
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center space-x-2 mr-4"
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl">
                <User size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-600">{currentUser.username}'s marine journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Summary */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                        🐠
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{currentUser.username}</h2>
                        <p className="text-blue-100">Level {currentUser.currentLevel} Marine Explorer</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress to Level {currentUser.currentLevel + 1}</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-3 bg-blue-400" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{currentUser.totalPoints?.toLocaleString()}</div>
                          <div className="text-blue-100 text-sm">Total Points</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{currentUser.gamesPlayed}</div>
                          <div className="text-blue-100 text-sm">Games Played</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Game Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span>Game Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(currentUser.bestScores).map(([gameType, score]) => (
                        <div key={gameType} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xl font-bold text-gray-900">{score}</div>
                          <div className="text-xs text-gray-600 capitalize">
                            {gameType.replace('_', ' ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span>Account Info</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600">Joined AQUASNAP</div>
                      <div className="font-semibold">{joinDate.toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Last Active</div>
                      <div className="font-semibold">{lastActive.toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Days Learning</div>
                      <div className="font-semibold">
                        {Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-purple-500" />
                      <span>Quick Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Achievements</span>
                      <span className="font-semibold">{currentUser.achievements.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certificates</span>
                      <span className="font-semibold">{currentUser.certificatesEarned.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Level</span>
                      <span className="font-semibold">{currentUser.currentLevel}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Your Achievements</span>
                </CardTitle>
                <CardDescription>
                  You've unlocked {currentUser.achievements.length} achievements on your marine learning journey!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentUser.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentUser.achievements.map((achievement) => (
                      <div key={achievement.id} className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-3xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No achievements yet. Start playing games to earn your first achievement!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span>Your Certificates</span>
                </CardTitle>
                <CardDescription>
                  Download and share your marine expertise certificates!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Marine Species Enthusiast Certificate */}
                  <div className={`p-6 border-2 rounded-lg transition-all ${
                    currentUser.certificatesEarned.includes('enthusiast')
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="text-center">
                      <div className="text-4xl mb-3">🏆</div>
                      <h3 className="text-lg font-semibold mb-2">Marine Species Enthusiast</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Awarded for reaching Level 5 and showing genuine interest in marine life
                      </p>
                      
                      {currentUser.certificatesEarned.includes('enthusiast') ? (
                        <div className="space-y-3">
                          <Badge className="bg-green-500">Earned!</Badge>
                          <Button 
                            onClick={() => downloadCertificate('enthusiast')}
                            className="w-full bg-blue-500 hover:bg-blue-600"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Certificate
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Badge variant="secondary">Reach Level 5</Badge>
                          <div className="text-xs text-gray-500">
                            {5 - currentUser.currentLevel} more levels to go!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Marine Species Expert Certificate */}
                  <div className={`p-6 border-2 rounded-lg transition-all ${
                    currentUser.certificatesEarned.includes('expert')
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="text-center">
                      <div className="text-4xl mb-3">🥇</div>
                      <h3 className="text-lg font-semibold mb-2">Marine Species Expert</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Awarded for reaching Level 10 and mastering marine species knowledge
                      </p>
                      
                      {currentUser.certificatesEarned.includes('expert') ? (
                        <div className="space-y-3">
                          <Badge className="bg-purple-500">Earned!</Badge>
                          <Button 
                            onClick={() => downloadCertificate('expert')}
                            className="w-full bg-purple-500 hover:bg-purple-600"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Certificate
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Badge variant="secondary">Reach Level 10</Badge>
                          <div className="text-xs text-gray-500">
                            {Math.max(0, 10 - currentUser.currentLevel)} more levels to go!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">📜 About Certificates</h4>
                  <p className="text-sm text-gray-700">
                    Your certificates recognize your dedication to learning about marine life and ocean conservation. 
                    Share them on social media or add them to your portfolio to showcase your environmental awareness!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span>Global Leaderboard</span>
                </CardTitle>
                <CardDescription>
                  See how you rank among other marine enthusiasts worldwide!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboardData.map((player, index) => (
                    <div 
                      key={player.username}
                      className={`flex items-center space-x-4 p-3 rounded-lg ${
                        player.username === currentUser.username 
                          ? 'bg-blue-50 border-2 border-blue-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{player.username}</h3>
                          {player.username === currentUser.username && (
                            <Badge variant="secondary" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          Level {player.level} • {player.points?.toLocaleString()} points
                        </div>
                      </div>
                      
                      {index === 0 && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                      {index === 1 && (
                        <div className="w-5 h-5 flex items-center justify-center text-gray-400">🥈</div>
                      )}
                      {index === 2 && (
                        <div className="w-5 h-5 flex items-center justify-center text-amber-600">🥉</div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold mb-2">🏆 Climb the Ranks!</h4>
                  <p className="text-sm text-gray-700">
                    Keep playing games, learning about marine species, and earning points to rise through the rankings. 
                    Every game helps you become a better ocean advocate!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}