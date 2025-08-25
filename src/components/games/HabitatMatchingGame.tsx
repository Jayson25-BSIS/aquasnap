'use client';

import React, { useState, useEffect, JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Star, CheckCircle, XCircle, Shuffle, Play } from 'lucide-react';
import { marineSpeciesData, getRandomSpecies } from '@/data/marineSpecies';
import type { MarineSpecies } from '@/data/marineSpecies';
import { useUserStore } from '@/store/userStore';

interface HabitatMatchingGameProps {
  onComplete: (score: number, correctAnswers: number, totalQuestions: number, completionTime: number) => void;
  onExit: () => void;
}

interface MatchPair {
  species: MarineSpecies;
  habitat: string;
}

export function HabitatMatchingGame({ onComplete, onExit }: HabitatMatchingGameProps): JSX.Element {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedHabitat, setSelectedHabitat] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [incorrectPairs, setIncorrectPairs] = useState<string[]>([]);
  const [roundData, setRoundData] = useState<MatchPair[]>([]);
  const [shuffledHabitats, setShuffledHabitats] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const { updateUserProgress } = useUserStore();

  const totalRounds = 8;
  const pairsPerRound = 4;
  const pointsPerMatch = 75;

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted, showResult]);

  const generateRoundData = (): void => {
    const selectedSpecies = getRandomSpecies(pairsPerRound, 5);
    const pairs: MatchPair[] = selectedSpecies.map(species => ({
      species,
      habitat: species.habitat
    }));
    
    // Shuffle habitats once per round, not on every render
    const habitats = [...new Set(pairs.map(pair => pair.habitat))];
    const shuffled = habitats.sort(() => 0.5 - Math.random());
    
    setRoundData(pairs);
    setShuffledHabitats(shuffled);
  };

  const startGame = (): void => {
    setGameStarted(true);
    setGameStartTime(Date.now());
    setTimeLeft(45);
    setCurrentRound(0);
    setScore(0);
    setCorrectAnswers(0);
    setMatches([]);
    setIncorrectPairs([]);
    generateRoundData();
  };

  const handleSpeciesClick = (speciesId: string): void => {
    if (matches.includes(speciesId) || incorrectPairs.includes(speciesId)) return;
    
    setSelectedSpecies(speciesId === selectedSpecies ? null : speciesId);
    setSelectedHabitat(null);
  };

  const handleHabitatClick = (habitat: string): void => {
    if (selectedSpecies) {
      checkMatch(selectedSpecies, habitat);
    } else {
      setSelectedHabitat(habitat === selectedHabitat ? null : habitat);
    }
  };

  const checkMatch = (speciesId: string, habitat: string): void => {
    const species = roundData.find(pair => pair.species.id === speciesId);
    
    if (species && species.habitat === habitat) {
      // Correct match
      setMatches(prev => [...prev, speciesId]);
      setCorrectAnswers(prev => prev + 1);
      
      const timeBonus = timeLeft > 30 ? 25 : timeLeft > 15 ? 15 : 0;
      const points = pointsPerMatch + timeBonus;
      setScore(prev => prev + points);
      
      // Check if round is complete
      if (matches.length + 1 === pairsPerRound) {
        setTimeout(() => {
          if (currentRound + 1 < totalRounds) {
            nextRound();
          } else {
            finishGame();
          }
        }, 1000);
      }
    } else {
      // Incorrect match
      setIncorrectPairs(prev => [...prev, speciesId]);
      setTimeout(() => {
        setIncorrectPairs(prev => prev.filter(id => id !== speciesId));
      }, 1000);
    }
    
    setSelectedSpecies(null);
    setSelectedHabitat(null);
  };

  const nextRound = (): void => {
    setCurrentRound(prev => prev + 1);
    setMatches([]);
    setIncorrectPairs([]);
    setTimeLeft(45);
    generateRoundData();
  };

  const handleTimeUp = (): void => {
    finishGame();
  };

  const finishGame = (): void => {
    const completionTime = Date.now() - gameStartTime;
    const totalQuestions = totalRounds * pairsPerRound;
    
    updateUserProgress(score, {
      gameType: 'habitat_matching',
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4">
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

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center space-x-2">
                <span className="text-3xl">🧩</span>
                <span>Habitat Matching</span>
              </CardTitle>
              <p className="text-gray-600">
                Match marine species with their natural habitats and learn about ocean ecosystems!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold mb-4">How to Play</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium">🎯 Objective</h4>
                    <p className="text-gray-700">Match each species with its correct habitat</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">⏱️ Time</h4>
                    <p className="text-gray-700">45 seconds per round</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">🏆 Scoring</h4>
                    <p className="text-gray-700">75 points per match + time bonus</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">🔄 Rounds</h4>
                    <p className="text-gray-700">8 rounds, 4 matches each</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Matching
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = ((currentRound + 1) / totalRounds) * 100;
  const roundProgress = (matches.length / pairsPerRound) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4">
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
                Round {currentRound + 1} of {totalRounds}
              </Badge>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">{score.toLocaleString()}</span>
              </div>
              <Badge variant="secondary">
                {matches.length} / {pairsPerRound} matched
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className={`font-semibold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{currentRound + 1} / {totalRounds}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span>Round Progress</span>
              <span>{matches.length} / {pairsPerRound}</span>
            </div>
            <Progress value={roundProgress} className="h-2 bg-green-100" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Species Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🐠</span>
                <span>Marine Species</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Click on a species to select it</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roundData.map((pair) => {
                  const isMatched = matches.includes(pair.species.id);
                  const isSelected = selectedSpecies === pair.species.id;
                  const isIncorrect = incorrectPairs.includes(pair.species.id);
                  
                  let cardClass = "cursor-pointer transition-all border-2 ";
                  
                  if (isMatched) {
                    cardClass += "bg-green-100 border-green-500 opacity-75";
                  } else if (isIncorrect) {
                    cardClass += "bg-red-100 border-red-500";
                  } else if (isSelected) {
                    cardClass += "bg-blue-100 border-blue-500";
                  } else {
                    cardClass += "border-gray-200 hover:border-blue-300 hover:shadow-md";
                  }

                  return (
                    <Card 
                      key={pair.species.id}
                      className={cardClass}
                      onClick={() => handleSpeciesClick(pair.species.id)}
                    >
                      <CardContent className="p-3">
                        <div className="relative mb-2">
                          <img
                            src={pair.species.imageUrl}
                            alt={pair.species.name}
                            className="w-full h-24 object-cover rounded"
                          />
                          {isMatched && (
                            <div className="absolute inset-0 bg-green-500/20 rounded flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                          )}
                          {isIncorrect && (
                            <div className="absolute inset-0 bg-red-500/20 rounded flex items-center justify-center">
                              <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-sm text-center">
                          {pair.species.name}
                        </h3>
                        <p className="text-xs text-gray-500 text-center">
                          {pair.species.scientificName}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Habitats Column */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🌊</span>
                <span>Habitats</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                {selectedSpecies ? 'Click on the correct habitat' : 'Select a species first'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shuffledHabitats.map((habitat, index) => {
                  const isMatched = roundData.some(pair => 
                    pair.habitat === habitat && matches.includes(pair.species.id)
                  );
                  const isSelected = selectedHabitat === habitat;
                  
                  let buttonClass = "w-full p-4 text-left h-auto justify-start transition-all border-2 ";
                  
                  if (isMatched) {
                    buttonClass += "bg-green-100 border-green-500 text-green-700 opacity-75";
                  } else if (isSelected) {
                    buttonClass += "bg-blue-100 border-blue-500";
                  } else if (selectedSpecies) {
                    buttonClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
                  } else {
                    buttonClass += "border-gray-200 opacity-50 cursor-not-allowed";
                  }

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={buttonClass}
                      onClick={() => handleHabitatClick(habitat)}
                      disabled={isMatched || !selectedSpecies}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{habitat}</span>
                        {isMatched && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-semibold mb-2">How to Match:</h4>
                <ol className="text-sm space-y-1 text-gray-700">
                  <li>1. Click on a marine species to select it</li>
                  <li>2. Click on the correct habitat for that species</li>
                  <li>3. Correct matches will turn green and be locked in</li>
                  <li>4. Wrong matches will flash red - try again!</li>
                  <li>5. Complete all 4 matches to advance to the next round</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}