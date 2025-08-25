'use client';

import React, { useState, useEffect, JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Star, CheckCircle, XCircle, Navigation, Thermometer, Wind } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

interface OceanCurrentsGameProps {
  onComplete: (score: number, correctAnswers: number, totalQuestions: number, completionTime: number) => void;
  onExit: () => void;
}

interface CurrentChallenge {
  id: number;
  scenario: string;
  description: string;
  currentPattern: string[][];
  correctPath: { row: number; col: number }[];
  startPoint: { row: number; col: number };
  endPoint: { row: number; col: number };
  obstacles: { row: number; col: number }[];
  hints: string[];
}

export function OceanCurrentsGame({ onComplete, onExit }: OceanCurrentsGameProps): JSX.Element {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [challenges, setChallenges] = useState<CurrentChallenge[]>([]);
  const [playerPath, setPlayerPath] = useState<{ row: number; col: number }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<{ row: number; col: number } | null>(null);
  const [pathComplete, setPathComplete] = useState(false);

  const { updateUserProgress } = useUserStore();

  const totalChallenges = 6;
  const pointsPerChallenge = 150;
  const gridSize = 8;

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      finishGame();
    }
  }, [timeLeft, gameStarted, showResult]);

  const generateChallenges = (): CurrentChallenge[] => {
    const gameChallenges: CurrentChallenge[] = [
      {
        id: 1,
        scenario: 'Gulf Stream Navigation',
        description: 'Navigate a ship through the warm Gulf Stream current from Florida to Europe',
        currentPattern: [
          ['~', '~', '→', '→', '→', '→', '~', '~'],
          ['~', '→', '→', '→', '→', '→', '→', '~'],
          ['~', '→', '→', '→', '→', '→', '→', '~'],
          ['~', '→', '→', '→', '→', '→', '→', '~'],
          ['~', '~', '→', '→', '→', '→', '~', '~'],
          ['~', '~', '~', '→', '→', '~', '~', '~'],
          ['~', '~', '~', '~', '~', '~', '~', '~'],
          ['~', '~', '~', '~', '~', '~', '~', '~']
        ],
        correctPath: [
          { row: 3, col: 0 },
          { row: 3, col: 1 },
          { row: 2, col: 2 },
          { row: 2, col: 3 },
          { row: 2, col: 4 },
          { row: 1, col: 5 },
          { row: 1, col: 6 },
          { row: 0, col: 7 }
        ],
        startPoint: { row: 3, col: 0 },
        endPoint: { row: 0, col: 7 },
        obstacles: [],
        hints: ['Follow the warm Gulf Stream eastward', 'The current flows stronger in the middle']
      },
      {
        id: 2,
        scenario: 'Antarctic Circumpolar Current',
        description: 'Follow the world\'s strongest current around Antarctica',
        currentPattern: [
          ['→', '→', '→', '→', '→', '→', '↓', '↓'],
          ['↑', '~', '~', '~', '~', '~', '~', '↓'],
          ['↑', '~', 'X', '~', '~', 'X', '~', '↓'],
          ['↑', '~', '~', '~', '~', '~', '~', '↓'],
          ['↑', '~', '~', 'X', '~', '~', '~', '↓'],
          ['↑', '~', '~', '~', '~', '~', '~', '↓'],
          ['↑', '~', '~', '~', '~', '~', '~', '↓'],
          ['←', '←', '←', '←', '←', '←', '←', '↑']
        ],
        correctPath: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 },
          { row: 0, col: 4 },
          { row: 0, col: 5 },
          { row: 0, col: 6 },
          { row: 0, col: 7 },
          { row: 1, col: 7 },
          { row: 7, col: 7 },
          { row: 7, col: 0 },
          { row: 0, col: 0 }
        ],
        startPoint: { row: 0, col: 0 },
        endPoint: { row: 0, col: 0 },
        obstacles: [
          { row: 2, col: 2 },
          { row: 2, col: 5 },
          { row: 4, col: 3 }
        ],
        hints: ['Follow the circular current around Antarctica', 'Avoid the icebergs marked with X']
      },
      {
        id: 3,
        scenario: 'California Current Upwelling',
        description: 'Navigate through the nutrient-rich California Current upwelling zone',
        currentPattern: [
          ['~', '~', '~', '~', '~', '~', '~', '~'],
          ['~', '↑', '↑', '↑', '~', '~', '~', '~'],
          ['~', '↓', '↓', '↓', '~', 'X', '~', '~'],
          ['~', '↓', '↓', '↓', '~', '~', '~', '~'],
          ['~', '↓', '↓', '↓', '~', '~', 'X', '~'],
          ['~', '↓', '↓', '↓', '~', '~', '~', '~'],
          ['~', '↓', '↓', '↓', '~', '~', '~', '~'],
          ['~', '~', '~', '~', '~', '~', '~', '~']
        ],
        correctPath: [
          { row: 1, col: 1 },
          { row: 1, col: 2 },
          { row: 1, col: 3 },
          { row: 2, col: 3 },
          { row: 3, col: 3 },
          { row: 4, col: 3 },
          { row: 5, col: 3 },
          { row: 6, col: 3 }
        ],
        startPoint: { row: 1, col: 1 },
        endPoint: { row: 6, col: 3 },
        obstacles: [
          { row: 2, col: 5 },
          { row: 4, col: 6 }
        ],
        hints: ['The California Current brings cold, nutrient-rich water', 'Navigate through the upwelling zone']
      },
      {
        id: 4,
        scenario: 'Kuroshio Current Challenge',
        description: 'Ride the warm Kuroshio Current past Japan toward North America',
        currentPattern: [
          ['~', '~', '~', '↗', '→', '→', '→', '~'],
          ['~', '~', '↗', '↗', '→', '→', '→', '→'],
          ['~', '↗', '↗', '→', '→', 'X', '→', '→'],
          ['↗', '↗', '→', '→', '→', '→', '→', '~'],
          ['↗', '→', '→', '→', '→', '→', '~', '~'],
          ['↗', '→', '→', 'X', '→', '~', '~', '~'],
          ['~', '→', '→', '→', '~', '~', '~', '~'],
          ['~', '~', '~', '~', '~', '~', '~', '~']
        ],
        correctPath: [
          { row: 4, col: 0 },
          { row: 3, col: 1 },
          { row: 2, col: 2 },
          { row: 1, col: 3 },
          { row: 0, col: 4 },
          { row: 0, col: 5 },
          { row: 0, col: 6 },
          { row: 1, col: 7 }
        ],
        startPoint: { row: 4, col: 0 },
        endPoint: { row: 1, col: 7 },
        obstacles: [
          { row: 2, col: 5 },
          { row: 5, col: 3 }
        ],
        hints: ['The Kuroshio is one of the strongest western boundary currents', 'Follow the warm current northeastward']
      },
      {
        id: 5,
        scenario: 'Deep Water Formation',
        description: 'Navigate sinking cold water in the North Atlantic deep water formation',
        currentPattern: [
          ['~', '~', '↓', '↓', '↓', '~', '~', '~'],
          ['~', '↓', '↓', '↓', '↓', '↓', '~', '~'],
          ['↓', '↓', '↓', 'X', '↓', '↓', '↓', '~'],
          ['↓', '↓', '↓', '↓', '↓', '↓', '↓', '↓'],
          ['↓', '↓', '↓', '↓', '↓', '↓', '↓', '↓'],
          ['↓', '↓', '↓', '↓', '↓', 'X', '↓', '↓'],
          ['~', '↓', '↓', '↓', '↓', '↓', '↓', '~'],
          ['~', '~', '↓', '↓', '↓', '~', '~', '~']
        ],
        correctPath: [
          { row: 0, col: 2 },
          { row: 1, col: 2 },
          { row: 2, col: 2 },
          { row: 3, col: 2 },
          { row: 4, col: 2 },
          { row: 5, col: 2 },
          { row: 6, col: 2 },
          { row: 7, col: 2 }
        ],
        startPoint: { row: 0, col: 2 },
        endPoint: { row: 7, col: 2 },
        obstacles: [
          { row: 2, col: 3 },
          { row: 5, col: 5 }
        ],
        hints: ['Cold, dense water sinks to form deep currents', 'Follow the downward flow to the deep ocean']
      },
      {
        id: 6,
        scenario: 'Global Thermohaline Circulation',
        description: 'Complete a global circulation pattern connecting surface and deep currents',
        currentPattern: [
          ['→', '→', '→', '↓', '↓', '←', '←', '←'],
          ['↑', '~', '~', '↓', '↓', '~', '~', '↓'],
          ['↑', '~', 'X', '↓', '↓', 'X', '~', '↓'],
          ['↑', '~', '~', '↓', '↓', '~', '~', '↓'],
          ['↑', '~', '~', '↓', '↓', '~', '~', '↓'],
          ['↑', '~', 'X', '→', '→', '~', '~', '↓'],
          ['↑', '~', '~', '~', '~', '~', '~', '↓'],
          ['↑', '←', '←', '←', '←', '←', '←', '↑']
        ],
        correctPath: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 },
          { row: 1, col: 3 },
          { row: 2, col: 3 },
          { row: 3, col: 3 },
          { row: 4, col: 3 },
          { row: 5, col: 3 },
          { row: 5, col: 4 },
          { row: 5, col: 5 },
          { row: 6, col: 5 },
          { row: 7, col: 5 }
        ],
        startPoint: { row: 0, col: 0 },
        endPoint: { row: 7, col: 5 },
        obstacles: [
          { row: 2, col: 2 },
          { row: 2, col: 5 },
          { row: 5, col: 2 }
        ],
        hints: ['Connect surface and deep water circulation', 'This current pattern drives global climate']
      }
    ];

    return gameChallenges;
  };

  const startGame = (): void => {
    const gameChallenges = generateChallenges();
    setChallenges(gameChallenges);
    setGameStarted(true);
    setGameStartTime(Date.now());
    setTimeLeft(90);
    setCurrentChallenge(0);
    setScore(0);
    setCorrectAnswers(0);
    // Initialize first challenge after challenges are set
    const firstChallenge = gameChallenges[0];
    if (firstChallenge) {
      setCurrentPosition(firstChallenge.startPoint);
      setPlayerPath([firstChallenge.startPoint]);
      setPathComplete(false);
    }
  };

  const initializeChallenge = (challengeIndex: number): void => {
    if (challengeIndex < challenges.length && challenges[challengeIndex]) {
      const challenge = challenges[challengeIndex];
      setCurrentPosition(challenge.startPoint);
      setPlayerPath([challenge.startPoint]);
      setPathComplete(false);
      setShowResult(false);
    }
  };

  const handleCellClick = (row: number, col: number): void => {
    if (showResult || pathComplete || !challenges.length) return;
    
    const challenge = challenges[currentChallenge];
    if (!challenge) return;
    
    const isObstacle = challenge.obstacles.some(obs => obs.row === row && obs.col === col);
    const isInPattern = challenge.currentPattern[row] && challenge.currentPattern[row][col] !== '~';
    
    if (isObstacle || !isInPattern) return;
    
    // Check if this cell is adjacent to current position or is the start position
    if (currentPosition) {
      const isAdjacent = Math.abs(row - currentPosition.row) <= 1 && 
                        Math.abs(col - currentPosition.col) <= 1 &&
                        (row !== currentPosition.row || col !== currentPosition.col);
      
      const isStartPosition = row === challenge.startPoint.row && col === challenge.startPoint.col;
      
      if (isAdjacent || isStartPosition) {
        const newPath = [...playerPath, { row, col }];
        setPlayerPath(newPath);
        setCurrentPosition({ row, col });
        
        // Check if reached end point
        if (row === challenge.endPoint.row && col === challenge.endPoint.col) {
          checkPath(newPath);
        }
      }
    }
  };

  const checkPath = (path: { row: number; col: number }[]): void => {
    const challenge = challenges[currentChallenge];
    const isCorrect = checkPathCorrectness(path, challenge.correctPath);
    
    setPathComplete(true);
    setShowResult(true);
    
    if (isCorrect) {
      const timeBonus = timeLeft > 60 ? 50 : timeLeft > 30 ? 25 : 0;
      const points = pointsPerChallenge + timeBonus;
      
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    }
    
    setTimeout(() => {
      setShowResult(false);
      
      if (currentChallenge + 1 < totalChallenges) {
        const nextChallenge = currentChallenge + 1;
        setCurrentChallenge(nextChallenge);
        initializeChallenge(nextChallenge);
      } else {
        finishGame();
      }
    }, 2500);
  };

  const checkPathCorrectness = (playerPath: { row: number; col: number }[], correctPath: { row: number; col: number }[]): boolean => {
    // Check if player reached the end point and followed a reasonable path
    const endPoint = correctPath[correctPath.length - 1];
    const playerEndPoint = playerPath[playerPath.length - 1];
    
    return playerEndPoint.row === endPoint.row && playerEndPoint.col === endPoint.col;
  };

  const resetChallenge = (): void => {
    const challenge = challenges[currentChallenge];
    setCurrentPosition(challenge.startPoint);
    setPlayerPath([challenge.startPoint]);
    setPathComplete(false);
  };

  const finishGame = (): void => {
    const completionTime = Date.now() - gameStartTime;
    
    updateUserProgress(score, {
      gameType: 'ocean_currents',
      score,
      correctAnswers,
      totalQuestions: totalChallenges,
      completionTime,
      completedAt: new Date().toISOString()
    });

    onComplete(score, correctAnswers, totalChallenges, completionTime);
  };

  // Game start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
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
                <span className="text-3xl">🌊</span>
                <span>Ocean Currents Navigator</span>
              </CardTitle>
              <p className="text-gray-600">
                Navigate through ocean currents and learn about global circulation patterns!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">How Ocean Currents Work</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Surface Currents</span>
                    </div>
                    <p className="text-gray-700">Driven by wind patterns and Earth's rotation</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-4 h-4 text-red-600" />
                      <span className="font-medium">Temperature</span>
                    </div>
                    <p className="text-gray-700">Warm and cold water drive circulation</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Wind className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">Deep Currents</span>
                    </div>
                    <p className="text-gray-700">Driven by density differences</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">Climate</span>
                    </div>
                    <p className="text-gray-700">Currents regulate global climate</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Current Symbols Guide:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg">→</span>
                    <span>Eastward flow</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg">←</span>
                    <span>Westward flow</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg">↑</span>
                    <span>Northward flow</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg">↓</span>
                    <span>Southward flow</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg">~</span>
                    <span>No current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg">X</span>
                    <span>Obstacle</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Start Navigation Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (gameStarted && challenges.length > 0) {
      initializeChallenge(0);
    }
  }, [gameStarted, challenges]);

  const challengeData = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / totalChallenges) * 100;

  if (!challengeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
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
              <Badge className="bg-cyan-500">
                Challenge {currentChallenge + 1} of {totalChallenges}
              </Badge>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">{score.toLocaleString()}</span>
              </div>
              <Badge variant="secondary">
                {challengeData.scenario}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Challenge Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">📍</span>
                <span>Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{challengeData.scenario}</h3>
                <p className="text-sm text-gray-600 mt-2">{challengeData.description}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Navigation Hints:</h4>
                <ul className="text-xs space-y-1">
                  {challengeData.hints.map((hint, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span className="text-gray-700">{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-3 rounded">
                <div className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Start:</span>
                    <span className="font-mono">({challengeData.startPoint.row}, {challengeData.startPoint.col})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Destination:</span>
                    <span className="font-mono">({challengeData.endPoint.row}, {challengeData.endPoint.col})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Path Length:</span>
                    <span className="font-mono">{playerPath.length - 1} steps</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={resetChallenge}
                variant="outline"
                className="w-full"
                disabled={showResult}
              >
                Reset Path
              </Button>
            </CardContent>
          </Card>

          {/* Ocean Grid */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🗺️</span>
                <span>Ocean Current Map</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Click adjacent cells to navigate through the currents</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-8 gap-1 p-4 bg-blue-900 rounded-lg">
                {challengeData.currentPattern.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const isStart = challengeData.startPoint.row === rowIndex && challengeData.startPoint.col === colIndex;
                    const isEnd = challengeData.endPoint.row === rowIndex && challengeData.endPoint.col === colIndex;
                    const isObstacle = challengeData.obstacles.some(obs => obs.row === rowIndex && obs.col === colIndex);
                    const isInPlayerPath = playerPath.some(pos => pos.row === rowIndex && pos.col === colIndex);
                    const isCurrent = currentPosition && currentPosition.row === rowIndex && currentPosition.col === colIndex;
                    
                    let cellClass = "w-12 h-12 rounded border-2 flex items-center justify-center text-xs font-mono cursor-pointer transition-all ";
                    
                    if (isObstacle) {
                      cellClass += "bg-gray-800 border-gray-600 text-red-400";
                    } else if (isStart) {
                      cellClass += "bg-green-400 border-green-600 text-green-900";
                    } else if (isEnd) {
                      cellClass += "bg-red-400 border-red-600 text-red-900";
                    } else if (isCurrent) {
                      cellClass += "bg-yellow-300 border-yellow-500 text-yellow-900 shadow-lg scale-110";
                    } else if (isInPlayerPath) {
                      cellClass += "bg-orange-300 border-orange-500 text-orange-900";
                    } else if (cell === '~') {
                      cellClass += "bg-blue-800 border-blue-700 text-blue-300";
                    } else {
                      cellClass += "bg-cyan-200 border-cyan-400 text-cyan-900 hover:bg-cyan-100";
                    }
                    
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={cellClass}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {isStart ? '🚢' :
                         isEnd ? '🎯' :
                         isObstacle ? 'X' :
                         isCurrent ? '📍' :
                         isInPlayerPath ? '•' :
                         cell}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Result Feedback */}
              {showResult && pathComplete && (
                <div className={`mt-4 p-4 rounded-lg text-center ${
                  correctAnswers > currentChallenge
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {correctAnswers > currentChallenge ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      correctAnswers > currentChallenge ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {correctAnswers > currentChallenge ? 'Navigation Successful!' : 'Navigation Failed!'}
                    </span>
                  </div>
                  
                  {correctAnswers > currentChallenge && (
                    <div className="text-sm text-green-700 mb-2">
                      +{pointsPerChallenge} points
                      {timeLeft > 30 && ' + time bonus'}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    {correctAnswers > currentChallenge 
                      ? `Great job! You successfully navigated the ${challengeData.scenario}.`
                      : `Try again! Follow the current patterns more carefully.`}
                  </div>
                  
                  {currentChallenge + 1 < totalChallenges && (
                    <div className="text-xs text-gray-500 mt-1">
                      Moving to next challenge...
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}