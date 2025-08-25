'use client';

import React, { useState, useEffect, JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Star, CheckCircle, XCircle, TreePine, Waves, Zap } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

interface EcosystemBuilderGameProps {
  onComplete: (score: number, correctAnswers: number, totalQuestions: number, completionTime: number) => void;
  onExit: () => void;
}

interface EcosystemLevel {
  id: number;
  name: string;
  description: string;
  requiredOrganisms: EcosystemOrganism[];
  currentOrganisms: EcosystemOrganism[];
  targetEcosystem: string;
}

interface EcosystemOrganism {
  id: string;
  name: string;
  type: 'producer' | 'primary' | 'secondary' | 'tertiary' | 'decomposer';
  icon: string;
  description: string;
  energyLevel: number;
}

export function EcosystemBuilderGame({ onComplete, onExit }: EcosystemBuilderGameProps): JSX.Element {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [availableOrganisms, setAvailableOrganisms] = useState<EcosystemOrganism[]>([]);
  const [selectedOrganism, setSelectedOrganism] = useState<EcosystemOrganism | null>(null);
  const [levels, setLevels] = useState<EcosystemLevel[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const { updateUserProgress } = useUserStore();

  const totalLevels = 5;
  const pointsPerCorrect = 100;

  // Organism database
  const organismDatabase: EcosystemOrganism[] = [
    // Producers
    { id: 'phytoplankton', name: 'Phytoplankton', type: 'producer', icon: '🦠', description: 'Microscopic ocean plants', energyLevel: 1 },
    { id: 'kelp', name: 'Kelp', type: 'producer', icon: '🌿', description: 'Large brown seaweed', energyLevel: 1 },
    { id: 'seagrass', name: 'Seagrass', type: 'producer', icon: '🌱', description: 'Underwater flowering plants', energyLevel: 1 },
    
    // Primary Consumers
    { id: 'krill', name: 'Krill', type: 'primary', icon: '🦐', description: 'Small shrimp-like crustaceans', energyLevel: 2 },
    { id: 'zooplankton', name: 'Zooplankton', type: 'primary', icon: '🔬', description: 'Tiny drifting animals', energyLevel: 2 },
    { id: 'sea_urchin', name: 'Sea Urchin', type: 'primary', icon: '🔴', description: 'Spiny echinoderms', energyLevel: 2 },
    
    // Secondary Consumers
    { id: 'small_fish', name: 'Small Fish', type: 'secondary', icon: '🐟', description: 'Sardines and anchovies', energyLevel: 3 },
    { id: 'jellyfish', name: 'Jellyfish', type: 'secondary', icon: '🪼', description: 'Gelatinous predators', energyLevel: 3 },
    { id: 'sea_turtle', name: 'Sea Turtle', type: 'secondary', icon: '🐢', description: 'Marine reptiles', energyLevel: 3 },
    
    // Tertiary Consumers
    { id: 'large_fish', name: 'Large Fish', type: 'tertiary', icon: '🐠', description: 'Tuna and mackerel', energyLevel: 4 },
    { id: 'seal', name: 'Seal', type: 'tertiary', icon: '🦭', description: 'Marine mammals', energyLevel: 4 },
    { id: 'shark', name: 'Shark', type: 'tertiary', icon: '🦈', description: 'Apex ocean predator', energyLevel: 4 },
    
    // Decomposers
    { id: 'bacteria', name: 'Marine Bacteria', type: 'decomposer', icon: '🦠', description: 'Microscopic decomposers', energyLevel: 1 },
    { id: 'sea_worms', name: 'Marine Worms', type: 'decomposer', icon: '🪱', description: 'Bottom-dwelling recyclers', energyLevel: 1 },
  ];

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      finishGame();
    }
  }, [timeLeft, gameStarted, showResult]);

  const generateLevels = (): void => {
    const gameLevels: EcosystemLevel[] = [
      {
        id: 1,
        name: 'Kelp Forest Foundation',
        description: 'Build the base of a kelp forest ecosystem',
        targetEcosystem: 'Kelp Forest',
        requiredOrganisms: [
          organismDatabase.find(o => o.id === 'kelp')!,
          organismDatabase.find(o => o.id === 'sea_urchin')!,
          organismDatabase.find(o => o.id === 'bacteria')!,
        ],
        currentOrganisms: []
      },
      {
        id: 2,
        name: 'Open Ocean Web',
        description: 'Create a balanced open ocean food chain',
        targetEcosystem: 'Open Ocean',
        requiredOrganisms: [
          organismDatabase.find(o => o.id === 'phytoplankton')!,
          organismDatabase.find(o => o.id === 'krill')!,
          organismDatabase.find(o => o.id === 'small_fish')!,
          organismDatabase.find(o => o.id === 'large_fish')!,
        ],
        currentOrganisms: []
      },
      {
        id: 3,
        name: 'Coral Reef Community',
        description: 'Build a diverse coral reef ecosystem',
        targetEcosystem: 'Coral Reef',
        requiredOrganisms: [
          organismDatabase.find(o => o.id === 'seagrass')!,
          organismDatabase.find(o => o.id === 'small_fish')!,
          organismDatabase.find(o => o.id === 'sea_turtle')!,
          organismDatabase.find(o => o.id === 'shark')!,
          organismDatabase.find(o => o.id === 'bacteria')!,
        ],
        currentOrganisms: []
      },
      {
        id: 4,
        name: 'Deep Sea Mystery',
        description: 'Create a deep ocean ecosystem',
        targetEcosystem: 'Deep Sea',
        requiredOrganisms: [
          organismDatabase.find(o => o.id === 'zooplankton')!,
          organismDatabase.find(o => o.id === 'jellyfish')!,
          organismDatabase.find(o => o.id === 'large_fish')!,
          organismDatabase.find(o => o.id === 'sea_worms')!,
        ],
        currentOrganisms: []
      },
      {
        id: 5,
        name: 'Complete Marine Ecosystem',
        description: 'Build a complex multi-level marine ecosystem',
        targetEcosystem: 'Complete Marine',
        requiredOrganisms: [
          organismDatabase.find(o => o.id === 'phytoplankton')!,
          organismDatabase.find(o => o.id === 'krill')!,
          organismDatabase.find(o => o.id === 'small_fish')!,
          organismDatabase.find(o => o.id === 'seal')!,
          organismDatabase.find(o => o.id === 'shark')!,
          organismDatabase.find(o => o.id === 'bacteria')!,
        ],
        currentOrganisms: []
      }
    ];

    setLevels(gameLevels);
    setAvailableOrganisms([...organismDatabase]);
  };

  const startGame = (): void => {
    generateLevels();
    setGameStarted(true);
    setGameStartTime(Date.now());
    setTimeLeft(120);
    setCurrentLevel(0);
    setScore(0);
    setCorrectAnswers(0);
  };

  const handleOrganismSelect = (organism: EcosystemOrganism): void => {
    setSelectedOrganism(organism);
  };

  const addOrganismToEcosystem = (): void => {
    if (!selectedOrganism) return;
    
    const currentLevelData = levels[currentLevel];
    const isRequired = currentLevelData.requiredOrganisms.some(req => req.id === selectedOrganism.id);
    const alreadyAdded = currentLevelData.currentOrganisms.some(curr => curr.id === selectedOrganism.id);
    
    if (alreadyAdded) return;
    
    // Add organism to current level
    const updatedLevels = [...levels];
    updatedLevels[currentLevel].currentOrganisms.push(selectedOrganism);
    setLevels(updatedLevels);
    
    if (isRequired) {
      setScore(prev => prev + pointsPerCorrect);
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Check if level is complete
    const allRequired = currentLevelData.requiredOrganisms.every(req =>
      updatedLevels[currentLevel].currentOrganisms.some(curr => curr.id === req.id)
    );
    
    if (allRequired) {
      setLevelComplete(true);
      setShowResult(true);
      
      setTimeout(() => {
        if (currentLevel + 1 < totalLevels) {
          setCurrentLevel(prev => prev + 1);
          setLevelComplete(false);
          setShowResult(false);
        } else {
          finishGame();
        }
      }, 2000);
    }
    
    setSelectedOrganism(null);
  };

  const finishGame = (): void => {
    const completionTime = Date.now() - gameStartTime;
    const totalQuestions = totalLevels;
    
    updateUserProgress(score, {
      gameType: 'ecosystem_builder',
      score,
      correctAnswers,
      totalQuestions,
      completionTime,
      completedAt: new Date().toISOString()
    });

    onComplete(score, correctAnswers, totalQuestions, completionTime);
  };

  // Game start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
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
                <span className="text-3xl">🏗️</span>
                <span>Ecosystem Builder</span>
              </CardTitle>
              <p className="text-gray-600">
                Build balanced marine ecosystems by arranging organisms in the correct food web!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">How to Play</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TreePine className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Build Ecosystems</span>
                    </div>
                    <p className="text-gray-700">Create 5 different marine ecosystems</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">Energy Flow</span>
                    </div>
                    <p className="text-gray-700">Understand food chains and energy transfer</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Time Challenge</span>
                    </div>
                    <p className="text-gray-700">Complete all ecosystems within 2 minutes</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">Scoring</span>
                    </div>
                    <p className="text-gray-700">100 points per correct organism placement</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Energy Levels Guide:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">🌱</span>
                    <span>Producers (Plants)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">🦐</span>
                    <span>Primary Consumers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-600">🐟</span>
                    <span>Secondary Consumers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600">🦈</span>
                    <span>Tertiary Consumers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-600">🦠</span>
                    <span>Decomposers</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <TreePine className="w-5 h-5 mr-2" />
                  Start Building Ecosystems
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentLevelData = levels[currentLevel];
  const progress = ((currentLevel + 1) / totalLevels) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
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
              <Badge className="bg-green-500">
                Level {currentLevel + 1} of {totalLevels}
              </Badge>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">{score.toLocaleString()}</span>
              </div>
              <Badge variant="secondary">
                {currentLevelData?.name}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className={`font-semibold ${timeLeft <= 30 ? 'text-red-600' : 'text-gray-900'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>

        {currentLevelData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Organism Library */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">🧬</span>
                  <span>Organism Library</span>
                </CardTitle>
                <p className="text-sm text-gray-600">Click to select organisms</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableOrganisms.map((organism) => {
                    const isSelected = selectedOrganism?.id === organism.id;
                    const isUsed = currentLevelData.currentOrganisms.some(o => o.id === organism.id);
                    
                    let cardClass = "cursor-pointer transition-all border-2 p-3 ";
                    
                    if (isUsed) {
                      cardClass += "bg-gray-100 border-gray-300 opacity-50";
                    } else if (isSelected) {
                      cardClass += "bg-blue-100 border-blue-500";
                    } else {
                      cardClass += "border-gray-200 hover:border-blue-300 hover:shadow-md";
                    }

                    return (
                      <Card 
                        key={organism.id}
                        className={cardClass}
                        onClick={() => !isUsed && handleOrganismSelect(organism)}
                      >
                        <CardContent className="p-0">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{organism.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{organism.name}</div>
                              <div className="text-xs text-gray-500">{organism.description}</div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs mt-1 ${
                                  organism.type === 'producer' ? 'border-green-500 text-green-700' :
                                  organism.type === 'primary' ? 'border-blue-500 text-blue-700' :
                                  organism.type === 'secondary' ? 'border-orange-500 text-orange-700' :
                                  organism.type === 'tertiary' ? 'border-red-500 text-red-700' :
                                  'border-purple-500 text-purple-700'
                                }`}
                              >
                                {organism.type}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {selectedOrganism && (
                  <div className="mt-4">
                    <Button 
                      onClick={addOrganismToEcosystem}
                      className="w-full"
                    >
                      Add to Ecosystem
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ecosystem Builder */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">🌊</span>
                  <span>{currentLevelData.targetEcosystem} Ecosystem</span>
                </CardTitle>
                <p className="text-sm text-gray-600">{currentLevelData.description}</p>
                <div className="text-xs text-blue-600">
                  {currentLevelData.currentOrganisms.length} / {currentLevelData.requiredOrganisms.length} required organisms added
                </div>
              </CardHeader>
              <CardContent>
                {/* Energy Level Zones */}
                <div className="space-y-4">
                  {[4, 3, 2, 1].map((energyLevel) => {
                    const levelOrganisms = currentLevelData.currentOrganisms.filter(o => o.energyLevel === energyLevel);
                    const levelName = energyLevel === 4 ? 'Apex Predators' : 
                                     energyLevel === 3 ? 'Secondary Consumers' :
                                     energyLevel === 2 ? 'Primary Consumers' : 'Producers & Decomposers';
                    const bgColor = energyLevel === 4 ? 'bg-red-50' : 
                                   energyLevel === 3 ? 'bg-orange-50' :
                                   energyLevel === 2 ? 'bg-blue-50' : 'bg-green-50';
                    
                    return (
                      <div key={energyLevel} className={`${bgColor} p-4 rounded-lg border-2 border-dashed border-gray-300`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{levelName}</span>
                          <Badge variant="outline">Energy Level {energyLevel}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {levelOrganisms.length === 0 ? (
                            <span className="text-gray-400 text-sm italic">Drop organisms here...</span>
                          ) : (
                            levelOrganisms.map((organism) => (
                              <div key={organism.id} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                                <span className="text-lg">{organism.icon}</span>
                                <span className="text-sm font-medium">{organism.name}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Level Complete Feedback */}
                {showResult && levelComplete && (
                  <div className="mt-6 p-4 rounded-lg text-center bg-green-50 border border-green-200">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="font-semibold text-green-700">
                        Ecosystem Complete!
                      </span>
                    </div>
                    <div className="text-sm text-green-700">
                      You've successfully built a balanced {currentLevelData.targetEcosystem} ecosystem!
                    </div>
                    {currentLevel + 1 < totalLevels && (
                      <div className="text-xs text-gray-600 mt-1">
                        Moving to next level...
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}