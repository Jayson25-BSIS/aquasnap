'use client';

import React, { JSX } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/userStore';
import { Trophy, Star, Play, User, Award, Target, Fish, BookOpen, Coins } from 'lucide-react';

interface DashboardProps {
  onNavigate: (screen: 'dashboard' | 'games' | 'profile' | 'fishtank' | 'learning' | 'purpose') => void;
}

export function Dashboard({ onNavigate }: DashboardProps): JSX.Element {
  const { currentUser, logout } = useUserStore();

  if (!currentUser) return <div>Loading...</div>;

  const nextLevelPoints = currentUser.currentLevel * 1000;
  const progressPercentage = (currentUser.levelProgress * 100);

  const recentAchievements = (currentUser.achievements || [])
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl">
                🐠
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AQUASNAP</h1>
                <p className="text-sm text-gray-600">Welcome back, {currentUser.username}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <Coins size={16} />
                <span>{(currentUser.currentSpendablePoints || 0).toLocaleString()}</span>
                <span className="text-xs opacity-90">spendable</span>
              </div>
              <Button
                variant="ghost"
                onClick={() => onNavigate('learning')}
                className="flex items-center space-x-2"
              >
                <BookOpen size={16} />
                <span>Marine Learning Hub</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2"
              >
                <User size={16} />
                <span>Profile</span>
              </Button>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - User Stats */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Level Progress Card */}
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-6 h-6" />
                  <span>Level {currentUser.currentLevel}</span>
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Marine Species Expert Path
                </CardDescription>
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
                  <div className="flex justify-between text-sm">
                    <span>Total Earned: {(currentUser.totalPointsEarned || 0).toLocaleString()}</span>
                    <span>Next: {(nextLevelPoints || 0).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Games Played</span>
                  <span className="font-semibold">{currentUser.gamesPlayed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Achievements</span>
                  <span className="font-semibold">{(currentUser.achievements || []).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificates</span>
                  <span className="font-semibold">{(currentUser.certificatesEarned || []).length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentAchievements.length > 0 ? (
                  <div className="space-y-3">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {achievement.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No achievements yet. Start playing to earn your first achievement! 🏆
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Welcome Message */}
            <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl">
                    🌊
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Ready to dive into marine knowledge?
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Test your skills with our interactive games and discover fascinating marine species 
                      while earning points, achievements, and certificates!
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <Button 
                        onClick={() => onNavigate('games')}
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Playing
                      </Button>
                      <Button 
                        onClick={() => onNavigate('fishtank')}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      >
                        <Fish className="w-4 h-4 mr-2" />
                        My Fish Tank
                      </Button>
                      <Button 
                        onClick={() => onNavigate('learning')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                      <Button 
                        onClick={() => onNavigate('purpose')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Our Mission
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* All Games - Scrollable Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="w-5 h-5 text-green-500" />
                  <span>All Games</span>
                </CardTitle>
                <CardDescription>
                  Scroll through all available marine learning games
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  
                  {/* Species Identification */}
                  <div className="min-w-[280px] flex-shrink-0">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={() => onNavigate('games')}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <span className="text-xl">🔍</span>
                          <span>Species Identification</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Test your ability to identify marine species by their images
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            Best: {currentUser.bestScores['species_identification'] || 0}
                          </div>
                          <Badge variant="secondary" className="text-xs">Easy → Expert</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Habitat Matching */}
                  <div className="min-w-[280px] flex-shrink-0">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={() => onNavigate('games')}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <span className="text-xl">🧩</span>
                          <span>Habitat Matching</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Match marine species with their natural habitats
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            Best: {currentUser.bestScores['habitat_matching'] || 0}
                          </div>
                          <Badge variant="secondary" className="text-xs">Educational</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Conservation Status */}
                  <div className="min-w-[280px] flex-shrink-0">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={() => onNavigate('games')}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <span className="text-xl">⚠️</span>
                          <span>Conservation Status</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Learn about marine conservation by matching species to their status
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            Best: {currentUser.bestScores['conservation_status'] || 0}
                          </div>
                          <Badge variant="secondary" className="text-xs">Awareness</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Marine Trivia */}
                  <div className="min-w-[280px] flex-shrink-0">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={() => onNavigate('games')}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <span className="text-xl">🎯</span>
                          <span>Marine Trivia</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Challenge yourself with interesting facts about ocean life
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            Best: {currentUser.bestScores['marine_trivia'] || 0}
                          </div>
                          <Badge variant="secondary" className="text-xs">Fun Facts</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Ecosystem Builder */}
                  <div className="min-w-[280px] flex-shrink-0">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={() => onNavigate('games')}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <span className="text-xl">🏗️</span>
                          <span>Ecosystem Builder</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Build balanced marine food webs and ecosystems
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            Best: {currentUser.bestScores['ecosystem_builder'] || 0}
                          </div>
                          <Badge variant="secondary" className="text-xs">Strategic</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Ocean Currents */}
                  <div className="min-w-[280px] flex-shrink-0">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={() => onNavigate('games')}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <span className="text-xl">🌊</span>
                          <span>Ocean Currents</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Navigate through global ocean circulation patterns
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            Best: {currentUser.bestScores['ocean_currents'] || 0}
                          </div>
                          <Badge variant="secondary" className="text-xs">Navigation</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Fish Rescue Mission */}
                  <div className="min-w-[280px] flex-shrink-0">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={() => onNavigate('games')}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <span className="text-xl">🆘</span>
                          <span>Fish Rescue Mission</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Save marine life from toxic environments with quick reflexes
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            Best: {currentUser.bestScores['fish_rescue'] || 0}
                          </div>
                          <Badge variant="secondary" className="text-xs">Action</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Marine Conservation Crisis */}
                  <div className="min-w-[280px] flex-shrink-0">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full" onClick={() => onNavigate('games')}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-sm">
                          <span className="text-xl">⚠️</span>
                          <span>Conservation Crisis</span>
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Make critical decisions to save endangered marine species
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-600">
                            Best: {currentUser.bestScores['conservation_crisis'] || 0}
                          </div>
                          <Badge variant="secondary" className="text-xs">Decision</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                </div>
                <p className="text-xs text-gray-500 mt-2">← Scroll to explore all games →</p>
              </CardContent>
            </Card>
            
            {/* Quick Access Grid - Popular Games */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('games')}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">🔍</span>
                    <span>Species Identification</span>
                  </CardTitle>
                  <CardDescription>
                    Most Popular - Test your ability to identify marine species
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Best Score: {currentUser.bestScores['species_identification'] || 0}
                    </div>
                    <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white">Popular</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('games')}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">🆘</span>
                    <span>Fish Rescue Mission</span>
                  </CardTitle>
                  <CardDescription>
                    Action Game - Save fish from toxic environments quickly!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Best Score: {currentUser.bestScores['fish_rescue'] || 0}
                    </div>
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">Action</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('games')}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">🏗️</span>
                    <span>Ecosystem Builder</span>
                  </CardTitle>
                  <CardDescription>
                    Strategic - Build balanced marine food webs and ecosystems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Best Score: {currentUser.bestScores['ecosystem_builder'] || 0}
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">Strategic</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certificates Section */}
            {currentUser.certificatesEarned.length > 0 && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span>Your Certificates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {currentUser.certificatesEarned.includes('enthusiast') && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2">
                        🏆 Marine Species Enthusiast
                      </Badge>
                    )}
                    {currentUser.certificatesEarned.includes('expert') && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
                        🥇 Marine Species Expert
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Download your certificates from your profile page to showcase your marine knowledge!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}