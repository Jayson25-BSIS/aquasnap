'use client';

import React, { useState, useEffect, useCallback, JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Star, Heart, Zap, AlertTriangle } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

interface FishRescueGameProps {
  onComplete: (score: number, correctAnswers: number, totalQuestions: number, completionTime: number) => void;
  onExit: () => void;
}

interface Fish {
  id: string;
  x: number;
  y: number;
  icon: string;
  species: string;
  rarity: 'common' | 'rare' | 'legendary';
  tapsRequired: number;
  currentTaps: number;
  isRescued: boolean;
  isInDanger: boolean;
  dangerLevel: number;
}

interface ToxicZone {
  x: number;
  y: number;
  size: number;
  intensity: number;
}

export function FishRescueGame({ onComplete, onExit }: FishRescueGameProps): JSX.Element {
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [fishRescued, setFishRescued] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [fish, setFish] = useState<Fish[]>([]);
  const [toxicZones, setToxicZones] = useState<ToxicZone[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const { updateUserProgress } = useUserStore();

  const fishSpecies = [
    { icon: '🐠', name: 'Clownfish', rarity: 'common' as const, tapsRequired: 1 },
    { icon: '🐡', name: 'Pufferfish', rarity: 'common' as const, tapsRequired: 1 },
    { icon: '🐟', name: 'Angelfish', rarity: 'common' as const, tapsRequired: 1 },
    { icon: '🦄', name: 'Seahorse', rarity: 'rare' as const, tapsRequired: 3 },
    { icon: '🦈', name: 'Baby Shark', rarity: 'rare' as const, tapsRequired: 4 },
    { icon: '🐙', name: 'Octopus', rarity: 'rare' as const, tapsRequired: 3 },
    { icon: '🪼', name: 'Jellyfish', rarity: 'rare' as const, tapsRequired: 2 },
    { icon: '🐋', name: 'Mini Whale', rarity: 'legendary' as const, tapsRequired: 5 },
  ];

  const maxLevel = 5;
  const fishPerLevel = Math.min(8 + level * 2, 20);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameOver && !levelComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver && !levelComplete) {
      handleGameOver();
    }
  }, [timeLeft, gameStarted, gameOver, levelComplete]);

  // Move fish and update danger levels
  useEffect(() => {
    if (!gameStarted || gameOver || levelComplete) return;

    const moveInterval = setInterval(() => {
      setFish(prevFish => 
        prevFish.map(fishItem => {
          if (fishItem.isRescued) return fishItem;

          // Move fish randomly within game area boundaries (match the actual visible area)
          const gameAreaWidth = 900; // Container max width minus padding
          const gameAreaHeight = 340; // h-96 = 384px minus padding
          const newX = Math.max(20, Math.min(gameAreaWidth - 20, fishItem.x + (Math.random() - 0.5) * 40));
          const newY = Math.max(20, Math.min(gameAreaHeight - 20, fishItem.y + (Math.random() - 0.5) * 40));

          // Check if fish is near toxic zones
          let isInDanger = false;
          let dangerLevel = 0;

          toxicZones.forEach(zone => {
            const distance = Math.sqrt(
              Math.pow(newX - zone.x, 2) + Math.pow(newY - zone.y, 2)
            );
            if (distance < zone.size) {
              isInDanger = true;
              dangerLevel = Math.max(dangerLevel, zone.intensity);
            }
          });

          // Fish dies if in high danger for too long
          if (isInDanger && fishItem.dangerLevel > 80) {
            setLives(prev => prev - 1);
            return { ...fishItem, isRescued: true }; // Remove from play
          }

          return {
            ...fishItem,
            x: newX,
            y: newY,
            isInDanger,
            dangerLevel: isInDanger ? 
              Math.min(100, fishItem.dangerLevel + 5) : 
              Math.max(0, fishItem.dangerLevel - 2)
          };
        })
      );
    }, 200);

    return () => clearInterval(moveInterval);
  }, [gameStarted, gameOver, levelComplete, toxicZones]);

  // Check level completion
  useEffect(() => {
    const activeFish = fish.filter(f => !f.isRescued);
    const rescuedFish = fish.filter(f => f.isRescued && f.dangerLevel === 0);
    
    if (activeFish.length === 0 && fish.length > 0) {
      setLevelComplete(true);
      setTimeout(() => {
        if (level < maxLevel) {
          nextLevel();
        } else {
          handleGameComplete();
        }
      }, 2000);
    }
  }, [fish, level]);

  // Check game over
  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      setTimeout(handleGameComplete, 2000);
    }
  }, [lives]);

  const generateLevel = useCallback((levelNum: number) => {
    // Generate fish
    const newFish: Fish[] = [];
    for (let i = 0; i < fishPerLevel; i++) {
      const speciesIndex = Math.floor(Math.random() * fishSpecies.length);
      const selectedSpecies = fishSpecies[speciesIndex];
      newFish.push({
        id: `fish-${i}`,
        x: Math.random() * 860 + 40, // Keep within game area boundaries
        y: Math.random() * 300 + 40, // Keep within visible height
        icon: selectedSpecies.icon,
        species: selectedSpecies.name,
        rarity: selectedSpecies.rarity,
        tapsRequired: selectedSpecies.tapsRequired,
        currentTaps: 0,
        isRescued: false,
        isInDanger: false,
        dangerLevel: 0
      });
    }

    // Generate toxic zones
    const newToxicZones: ToxicZone[] = [];
    const zoneCount = Math.min(levelNum + 2, 8);
    for (let i = 0; i < zoneCount; i++) {
      newToxicZones.push({
        x: Math.random() * 800 + 50, // Keep toxic zones within boundaries
        y: Math.random() * 280 + 50, // Keep within visible area
        size: 60 + Math.random() * 40,
        intensity: Math.random() * 50 + 50
      });
    }

    setFish(newFish);
    setToxicZones(newToxicZones);
    setTimeLeft(45 + levelNum * 5);
    setLevelComplete(false);
  }, [fishPerLevel]);

  const startGame = () => {
    setGameStarted(true);
    setGameStartTime(Date.now());
    setLevel(1);
    setScore(0);
    setFishRescued(0);
    setLives(3);
    setGameOver(false);
    generateLevel(1);
  };

  const nextLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
    generateLevel(newLevel);
  };

  const rescueFish = (fishId: string) => {
    setFish(prevFish => 
      prevFish.map(fishItem => {
        if (fishItem.id === fishId && !fishItem.isRescued) {
          const newTaps = fishItem.currentTaps + 1;
          
          if (newTaps >= fishItem.tapsRequired) {
            // Fish is rescued!
            const basePoints = fishItem.rarity === 'common' ? 50 : fishItem.rarity === 'rare' ? 100 : 200;
            const dangerBonus = fishItem.isInDanger ? Math.max(0, 100 - fishItem.dangerLevel) : 0;
            const rarityBonus = fishItem.rarity === 'legendary' ? 100 : fishItem.rarity === 'rare' ? 50 : 0;
            
            setScore(prev => prev + basePoints + dangerBonus + rarityBonus);
            setFishRescued(prev => prev + 1);
            
            return { ...fishItem, isRescued: true, dangerLevel: 0, currentTaps: newTaps };
          } else {
            // Fish needs more taps
            return { ...fishItem, currentTaps: newTaps };
          }
        }
        return fishItem;
      })
    );
  };

  const handleGameOver = () => {
    setGameOver(true);
    setTimeout(handleGameComplete, 2000);
  };

  const handleGameComplete = () => {
    const completionTime = Date.now() - gameStartTime;
    
    updateUserProgress(score, {
      gameType: 'fish_rescue',
      score,
      correctAnswers: fishRescued,
      totalQuestions: fish.length,
      completionTime,
      completedAt: new Date().toISOString()
    });

    onComplete(score, fishRescued, fish.length, completionTime);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={onExit}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Games</span>
            </Button>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                <span className="text-3xl">🆘</span>
                <span>Fish Rescue Mission</span>
              </CardTitle>
              <p className="text-gray-600">
                Save marine life from toxic pollution! Tap fish to rescue them before it's too late!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold mb-4 text-red-800">⚠️ Environmental Crisis</h3>
                <p className="text-red-700 text-sm">
                  Ocean pollution is threatening marine ecosystems worldwide. Toxic zones are spreading, 
                  and marine life needs immediate rescue. Every fish you save makes a difference!
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">How to Play</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-500">👆</span>
                    <span><strong>Tap fish</strong> to rescue them - small fish need 1 tap, rare fish need more!</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-orange-500">⚠️</span>
                    <span><strong>Orange zones</strong> are toxic - fish turn red when in danger</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">⚡</span>
                    <span><strong>Rescue quickly</strong> for bonus points - danger increases over time</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">💔</span>
                    <span><strong>You lose a life</strong> if a fish dies from toxicity</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Start Rescue Mission
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onExit}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Exit Game</span>
          </Button>
        </div>

        {/* Game Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-500">
                Level {level} of {maxLevel}
              </Badge>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">{score.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-semibold">{lives} lives</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🐠</span>
                <span className="font-semibold">{fishRescued} rescued</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className={`font-semibold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          
          <Progress value={(fishRescued / fishPerLevel) * 100} className="h-2" />
        </div>

        {/* Game Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🌊</span>
              <span>Ocean Rescue Zone</span>
              {(levelComplete || gameOver) && (
                <Badge variant={gameOver ? "destructive" : "default"}>
                  {gameOver ? "Mission Failed" : "Level Complete!"}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-96 bg-gradient-to-b from-blue-300 to-blue-500 rounded-lg overflow-hidden border-4 border-blue-400">
              {/* Toxic Zones */}
              {toxicZones.map((zone, index) => (
                <div
                  key={index}
                  className="absolute rounded-full bg-orange-400 opacity-70 animate-pulse"
                  style={{
                    left: zone.x,
                    top: zone.y,
                    width: zone.size,
                    height: zone.size,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 20px rgba(255, 165, 0, 0.6)'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-800" />
                  </div>
                </div>
              ))}

              {/* Fish */}
              {fish.map((fishItem) => (
                !fishItem.isRescued && (
                  <div
                    key={fishItem.id}
                    className={`absolute cursor-pointer transition-all duration-200 hover:scale-125 select-none ${
                      fishItem.isInDanger ? 'animate-bounce' : ''
                    } ${fishItem.currentTaps > 0 ? 'animate-pulse' : ''}`}
                    style={{
                      left: fishItem.x,
                      top: fishItem.y,
                      transform: 'translate(-50%, -50%)',
                      filter: fishItem.isInDanger ? 
                        `hue-rotate(${fishItem.dangerLevel}deg) brightness(${1.2 + fishItem.dangerLevel / 200})` : 
                        'none',
                      zIndex: 10,
                      pointerEvents: 'auto'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      rescueFish(fishItem.id);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="text-4xl pointer-events-none select-none">{fishItem.icon}</div>
                    
                    {/* Rarity indicator */}
                    <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full ${
                      fishItem.rarity === 'legendary' ? 'bg-purple-500' :
                      fishItem.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></div>
                    
                    {/* Tap progress indicator */}
                    {fishItem.tapsRequired > 1 && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-1">
                          {Array.from({ length: fishItem.tapsRequired }, (_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < fishItem.currentTaps ? 'bg-green-400' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {fishItem.isInDanger && (
                      <div className="absolute -top-2 -right-2">
                        <Zap className="w-3 h-3 text-red-500 animate-pulse" />
                      </div>
                    )}
                    
                    {/* Danger level indicator */}
                    {fishItem.dangerLevel > 20 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-1 bg-gray-300 rounded">
                          <div 
                            className="h-full bg-red-500 rounded transition-all"
                            style={{ width: `${fishItem.dangerLevel}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              ))}

              {/* Water effects */}
              <div className="absolute inset-0 bg-blue-400 opacity-20 animate-pulse"></div>
              
              {/* Floating bubbles */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full opacity-50 animate-bounce delay-300"></div>
              <div className="absolute bottom-12 left-16 w-1.5 h-1.5 bg-white rounded-full opacity-70 animate-bounce delay-700"></div>
            </div>

            {/* Status Messages */}
            {(levelComplete || gameOver) && (
              <div className={`mt-4 p-4 rounded-lg text-center ${
                gameOver 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                <div className="text-lg font-semibold mb-2">
                  {gameOver ? 
                    `💔 Mission Failed - ${fishRescued} fish rescued` : 
                    `🎉 Level ${level} Complete! All fish saved!`}
                </div>
                <div className="text-sm">
                  Score: {score.toLocaleString()} points
                  {!gameOver && level < maxLevel && (
                    <div className="mt-1">Moving to Level {level + 1}...</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}