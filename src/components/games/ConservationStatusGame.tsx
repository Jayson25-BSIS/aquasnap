'use client';

import React, { useState, useEffect, JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Star, CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';
import { marineSpeciesData, getRandomSpecies } from '@/data/marineSpecies';
import type { MarineSpecies } from '@/data/marineSpecies';
import { useUserStore } from '@/store/userStore';

interface ConservationStatusGameProps {
  onComplete: (score: number, correctAnswers: number, totalQuestions: number, completionTime: number) => void;
  onExit: () => void;
}

interface ConservationQuestion {
  species: MarineSpecies;
  options: string[];
  correctAnswer: string;
}

export function ConservationStatusGame({ onComplete, onExit }: ConservationStatusGameProps): JSX.Element {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<ConservationQuestion[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [streak, setStreak] = useState(0);

  const { updateUserProgress } = useUserStore();

  const totalQuestions = 12;
  const pointsPerCorrect = 60;

  // Conservation status information
  const conservationInfo = {
    'Least Concern': {
      icon: '🟢',
      description: 'Species is abundant and not at risk of extinction',
      color: 'text-green-600'
    },
    'Near Threatened': {
      icon: '🟡',
      description: 'Species may become threatened in the near future',
      color: 'text-yellow-600'
    },
    'Vulnerable': {
      icon: '🟠',
      description: 'Species faces a high risk of extinction in the wild',
      color: 'text-orange-600'
    },
    'Endangered': {
      icon: '🔴',
      description: 'Species faces a very high risk of extinction',
      color: 'text-red-600'
    },
    'Critically Endangered': {
      icon: '🚨',
      description: 'Species faces extremely high risk of extinction',
      color: 'text-red-800'
    }
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted, showResult]);

  const generateQuestions = (): void => {
    const gameQuestions: ConservationQuestion[] = [];
    const selectedSpecies = getRandomSpecies(totalQuestions, 5);
    const allStatuses = Object.keys(conservationInfo);

    selectedSpecies.forEach((species) => {
      // Create wrong options from other conservation statuses
      const wrongStatuses = allStatuses
        .filter(status => status !== species.conservationStatus)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [species.conservationStatus, ...wrongStatuses]
        .sort(() => 0.5 - Math.random());

      gameQuestions.push({
        species,
        options: allOptions,
        correctAnswer: species.conservationStatus
      });
    });

    setQuestions(gameQuestions);
  };

  const startGame = (): void => {
    generateQuestions();
    setGameStarted(true);
    setGameStartTime(Date.now());
    setTimeLeft(40);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
  };

  const handleAnswer = (answer: string): void => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      const newStreak = streak + 1;
      const streakBonus = newStreak >= 3 ? Math.floor(newStreak / 3) * 30 : 0;
      const timeBonus = timeLeft > 25 ? 30 : timeLeft > 15 ? 20 : 0;
      
      // Bonus points for endangered species awareness
      const conservationBonus = ['Endangered', 'Critically Endangered'].includes(answer) ? 20 : 0;
      
      const points = pointsPerCorrect + streakBonus + timeBonus + conservationBonus;
      
      setScore(prevScore => prevScore + points);
      setCorrectAnswers(prev => prev + 1);
      setStreak(newStreak);
    } else {
      setStreak(0);
    }

    setShowResult(true);
    
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      
      if (currentQuestion + 1 < totalQuestions) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(40);
      } else {
        finishGame();
      }
    }, 2000);
  };

  const handleTimeUp = (): void => {
    setStreak(0);
    setShowResult(true);
    
    setTimeout(() => {
      setShowResult(false);
      
      if (currentQuestion + 1 < totalQuestions) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(40);
      } else {
        finishGame();
      }
    }, 2000);
  };

  const finishGame = (): void => {
    const completionTime = Date.now() - gameStartTime;
    
    updateUserProgress(score, {
      gameType: 'conservation_status',
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
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
                <span className="text-3xl">⚠️</span>
                <span>Conservation Status</span>
              </CardTitle>
              <p className="text-gray-600">
                Learn about marine conservation by identifying species conservation status!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Conservation Status Legend */}
              <div className="bg-white p-4 rounded-lg border-2 border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-center">Conservation Status Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(conservationInfo).map(([status, info]) => (
                    <div key={status} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                      <span className="text-xl">{info.icon}</span>
                      <div>
                        <div className={`font-medium text-sm ${info.color}`}>
                          {status}
                        </div>
                        <div className="text-xs text-gray-600">
                          {info.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Game Info */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Game Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="font-medium">Mission</span>
                    </div>
                    <p className="text-gray-700">Identify the conservation status of marine species</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Time</span>
                    </div>
                    <p className="text-gray-700">40 seconds per question</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">Scoring</span>
                    </div>
                    <p className="text-gray-700">60 points + time & streak bonuses</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Impact</span>
                    </div>
                    <p className="text-gray-700">Learn about species at risk!</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Start Conservation Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQuestionData?.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
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
              <Badge className="bg-orange-500">
                Question {currentQuestion + 1} of {totalQuestions}
              </Badge>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">{score.toLocaleString()}</span>
              </div>
              {streak > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  🔥 {streak} streak
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className={`font-semibold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What is this marine species' conservation status?</CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestionData && (
              <div className="space-y-6">
                {/* Species Info */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <img
                      src={currentQuestionData.species.imageUrl}
                      alt="Marine species"
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <div className="md:w-1/2 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {currentQuestionData.species.name}
                      </h3>
                      <p className="text-gray-600 italic">
                        {currentQuestionData.species.scientificName}
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Habitat:</span> {currentQuestionData.species.habitat}
                      </div>
                      <div>
                        <span className="font-medium">Diet:</span> {currentQuestionData.species.diet}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {currentQuestionData.species.size}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="font-medium text-blue-900 mb-1">Did you know?</div>
                      <div className="text-sm text-blue-800">
                        {currentQuestionData.species.funFact}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentQuestionData.options.map((option, index) => {
                    const statusInfo = conservationInfo[option as keyof typeof conservationInfo];
                    let buttonClass = "text-left p-4 h-auto justify-start transition-all";
                    
                    if (showResult && selectedAnswer) {
                      if (option === currentQuestionData.correctAnswer) {
                        buttonClass += " bg-green-100 border-green-500 text-green-700";
                      } else if (option === selectedAnswer) {
                        buttonClass += " bg-red-100 border-red-500 text-red-700";
                      } else {
                        buttonClass += " opacity-50";
                      }
                    } else {
                      buttonClass += " hover:bg-orange-50 border-gray-200";
                    }

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={buttonClass}
                        onClick={() => !isAnswered && handleAnswer(option)}
                        disabled={isAnswered}
                      >
                        <div className="flex flex-col items-start space-y-2 w-full">
                          <div className="flex items-center space-x-3 w-full">
                            <span className="text-2xl">{statusInfo.icon}</span>
                            <span className="flex-1 font-medium">{option}</span>
                            {showResult && option === currentQuestionData.correctAnswer && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            {showResult && option === selectedAnswer && option !== currentQuestionData.correctAnswer && (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div className="text-xs text-gray-600 text-left">
                            {statusInfo.description}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                {/* Result Feedback */}
                {showResult && (
                  <div className={`p-4 rounded-lg text-center ${
                    isCorrect 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <span className={`font-semibold ${
                        isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {isCorrect ? 'Correct!' : 'Incorrect!'}
                      </span>
                    </div>
                    
                    {isCorrect && (
                      <div className="text-sm text-green-700 mb-2">
                        +{pointsPerCorrect} points
                        {streak >= 3 && ` + ${Math.floor(streak / 3) * 30} streak bonus`}
                        {timeLeft > 15 && ' + time bonus'}
                        {['Endangered', 'Critically Endangered'].includes(selectedAnswer || '') && ' + 20 awareness bonus'}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-700 mt-3 p-3 bg-white/50 rounded">
                      <div className="font-semibold mb-2">
                        {currentQuestionData.species.name} is {currentQuestionData.correctAnswer}
                      </div>
                      <div className="text-xs">
                        {conservationInfo[currentQuestionData.correctAnswer as keyof typeof conservationInfo].description}
                      </div>
                      {['Vulnerable', 'Endangered', 'Critically Endangered'].includes(currentQuestionData.correctAnswer) && (
                        <div className="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded">
                          🚨 This species needs our protection! Learn more about marine conservation.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}