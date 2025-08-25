'use client';

import React, { JSX, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Star, Trophy, Target, BookOpen } from 'lucide-react';
import { SpeciesIdentificationGame } from '@/components/games/SpeciesIdentificationGame';
import { HabitatMatchingGame } from './HabitatMatchingGame';
import { ConservationStatusGame } from '@/components/games/ConservationStatusGame';
import { MarineTriviaGame } from './MarineTriviaGame';
import { EcosystemBuilderGame } from './EcosystemBuilderGame';
import { OceanCurrentsGame } from './OceanCurrentsGame';
import { useUserStore } from '@/store/userStore';

interface GameLibraryProps {
  onBack: () => void;
}

type GameType = 'species_identification' | 'habitat_matching' | 'conservation_status' | 'marine_trivia' | 'ecosystem_builder' | 'ocean_currents' | null;

export function GameLibrary({ onBack }: GameLibraryProps): JSX.Element {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const { currentUser } = useUserStore();

  if (!currentUser) return <div>Loading...</div>;

  // Game configuration
  const games = [
    {
      id: 'species_identification' as const,
      name: 'Species Identification',
      description: 'Test your ability to identify marine species by their images. Multiple difficulty levels available!',
      icon: '🔍',
      difficulty: 'Easy → Expert',
      color: 'from-blue-500 to-cyan-500',
      points: '50-200 points per game',
      bestScore: currentUser.bestScores['species_identification'] || 0
    },
    {
      id: 'habitat_matching' as const,
      name: 'Habitat Matching', 
      description: 'Match marine species with their natural habitats and learn about ocean ecosystems.',
      icon: '🧩',
      difficulty: 'Educational',
      color: 'from-green-500 to-teal-500',
      points: '75-150 points per game',
      bestScore: currentUser.bestScores['habitat_matching'] || 0
    },
    {
      id: 'conservation_status' as const,
      name: 'Conservation Status',
      description: 'Learn about marine conservation by matching species to their current conservation status.',
      icon: '⚠️',
      difficulty: 'Awareness',
      color: 'from-orange-500 to-red-500',
      points: '60-180 points per game',
      bestScore: currentUser.bestScores['conservation_status'] || 0
    },
    {
      id: 'marine_trivia' as const,
      name: 'Marine Trivia',
      description: 'Challenge yourself with fascinating facts about ocean life and marine biology.',
      icon: '🎯',
      difficulty: 'Fun Facts',
      color: 'from-purple-500 to-pink-500',
      points: '40-160 points per game',
      bestScore: currentUser.bestScores['marine_trivia'] || 0
    },
    {
      id: 'ecosystem_builder' as const,
      name: 'Ecosystem Builder',
      description: 'Build balanced marine food webs by arranging organisms in the correct energy levels.',
      icon: '🏗️',
      difficulty: 'Strategic',
      color: 'from-green-500 to-blue-500',
      points: '100-500 points per game',
      bestScore: currentUser.bestScores['ecosystem_builder'] || 0
    },
    {
      id: 'ocean_currents' as const,
      name: 'Ocean Currents',
      description: 'Navigate through global ocean currents and learn about marine circulation patterns.',
      icon: '🌊',
      difficulty: 'Navigation',
      color: 'from-cyan-500 to-blue-500',
      points: '150-400 points per game',
      bestScore: currentUser.bestScores['ocean_currents'] || 0
    }
  ];

  // Render active game
  if (selectedGame) {
    const gameProps = {
      onComplete: (score: number, correctAnswers: number, totalQuestions: number, completionTime: number) => {
        setSelectedGame(null);
      },
      onExit: () => setSelectedGame(null)
    };

    switch (selectedGame) {
      case 'species_identification':
        return <SpeciesIdentificationGame {...gameProps} />;
      case 'habitat_matching':
        return <HabitatMatchingGame {...gameProps} />;
      case 'conservation_status':
        return <ConservationStatusGame {...gameProps} />;
      case 'marine_trivia':
        return <MarineTriviaGame {...gameProps} />;
      case 'ecosystem_builder':
        return <EcosystemBuilderGame {...gameProps} />;
      case 'ocean_currents':
        return <OceanCurrentsGame {...gameProps} />;
      default:
        return <div>Game not found</div>;
    }
  }

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
                🎮
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Game Library</h1>
                <p className="text-sm text-gray-600">Choose your marine learning adventure</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Games</h2>
          <p className="text-gray-600">
            Test your marine knowledge and earn points, achievements, and certificates!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${game.color}`} />
              
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{game.icon}</span>
                    <span className="text-lg">{game.name}</span>
                  </div>
                  <Badge variant="secondary">{game.difficulty}</Badge>
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {game.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Game Stats */}
                  <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600">Best Score:</span>
                      <span className="font-semibold">{game.bestScore}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600">{game.points}</span>
                    </div>
                  </div>

                  {/* Game Features */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Target className="w-3 h-3 mr-1" />
                      Interactive
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Educational
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ⏱️ Timed
                    </Badge>
                  </div>

                  {/* Play Button */}
                  <Button 
                    onClick={() => setSelectedGame(game.id)}
                    className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 transition-opacity`}
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Game
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Tips */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">💡</span>
              <span>Pro Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">🎯 Maximize Your Score</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Answer quickly for bonus points</li>
                  <li>• Complete streak bonuses</li>
                  <li>• Try harder difficulty levels</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">🏆 Unlock Achievements</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>• Play different game types</li>
                  <li>• Reach level milestones</li>
                  <li>• Complete perfect games</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}