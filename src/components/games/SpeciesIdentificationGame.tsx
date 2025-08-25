'use client';

import React, { useState, useEffect, JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Star, CheckCircle, XCircle } from 'lucide-react';
import { marineSpeciesData, getRandomSpecies } from '@/data/marineSpecies';
import type { MarineSpecies } from '@/data/marineSpecies';
import { useUserStore } from '@/store/userStore';

interface SpeciesIdentificationGameProps {
  onComplete: (score: number, correctAnswers: number, totalQuestions: number, completionTime: number) => void;
  onExit: () => void;
}

interface GameQuestion {
  species: MarineSpecies;
  options: string[];
  correctAnswer: string;
}

export function SpeciesIdentificationGame({ onComplete, onExit }: SpeciesIdentificationGameProps): JSX.Element {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [streak, setStreak] = useState(0);

  const { updateUserProgress } = useUserStore();

  const totalQuestions = 10;
  const pointsPerCorrect = difficulty * 50;

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted, showResult]);

  const generateQuestions = (selectedDifficulty: number): void => {
    const gameQuestions: GameQuestion[] = [];
    const availableSpecies = marineSpeciesData.filter(s => s.difficultyLevel <= selectedDifficulty);
    const selectedSpecies = getRandomSpecies(totalQuestions, selectedDifficulty);

    selectedSpecies.forEach((species) => {
      // Create wrong options from other species
      const wrongOptions = availableSpecies
        .filter(s => s.id !== species.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(s => s.name);

      const allOptions = [species.name, ...wrongOptions].sort(() => 0.5 - Math.random());

      gameQuestions.push({
        species,
        options: allOptions,
        correctAnswer: species.name
      });
    });

    setQuestions(gameQuestions);
  };

  const startGame = (selectedDifficulty: 1 | 2 | 3): void => {
    setDifficulty(selectedDifficulty);
    generateQuestions(selectedDifficulty);
    setGameStarted(true);
    setGameStartTime(Date.now());
    setTimeLeft(30);
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
      const streakBonus = newStreak >= 3 ? Math.floor(newStreak / 3) * 25 : 0;
      const timeBonus = timeLeft > 20 ? 25 : timeLeft > 10 ? 15 : 0;
      const points = pointsPerCorrect + streakBonus + timeBonus;
      
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
        setTimeLeft(30);
      } else {
        finishGame();
      }
    }, 1500);
  };

  const handleTimeUp = (): void => {
    setStreak(0);
    setShowResult(true);
    
    setTimeout(() => {
      setShowResult(false);
      
      if (currentQuestion + 1 < totalQuestions) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(30);
      } else {
        finishGame();
      }
    }, 1500);
  };

  const finishGame = (): void => {
    const completionTime = Date.now() - gameStartTime;
    
    // Update user progress
    updateUserProgress(score, {
      gameType: 'species_identification',
      score,
      correctAnswers,
      totalQuestions,
      completionTime,
      completedAt: new Date().toISOString()
    });

    onComplete(score, correctAnswers, totalQuestions, completionTime);
  };

  // Difficulty selection screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
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
                <span className="text-3xl">🔍</span>
                <span>Species Identification</span>
              </CardTitle>
              <p className="text-gray-600">
                Identify marine species from their images. Choose your difficulty level!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Beginner */}
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300"
                  onClick={() => startGame(1)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">🟢</div>
                    <h3 className="text-lg font-semibold mb-2">Beginner</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Common marine species that are easy to identify
                    </p>
                    <Badge variant="secondary" className="mb-2">50 points each</Badge>
                    <div className="text-xs text-gray-500">
                      Difficulty 1-2 species
                    </div>
                  </CardContent>
                </Card>

                {/* Intermediate */}
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-yellow-300"
                  onClick={() => startGame(2)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">🟡</div>
                    <h3 className="text-lg font-semibold mb-2">Intermediate</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Mix of common and less familiar species
                    </p>
                    <Badge variant="secondary" className="mb-2">100 points each</Badge>
                    <div className="text-xs text-gray-500">
                      Difficulty 1-3 species
                    </div>
                  </CardContent>
                </Card>

                {/* Expert */}
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-red-300"
                  onClick={() => startGame(3)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">🔴</div>
                    <h3 className="text-lg font-semibold mb-2">Expert</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Challenging species including rare and deep-sea creatures
                    </p>
                    <Badge variant="secondary" className="mb-2">150 points each</Badge>
                    <div className="text-xs text-gray-500">
                      All difficulty levels
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Game Rules:</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• 10 questions total, 30 seconds each</li>
                  <li>• Earn bonus points for quick answers and streaks</li>
                  <li>• 3+ correct answers in a row = streak bonus!</li>
                  <li>• Answer in under 10 seconds for time bonus</li>
                </ul>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
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
              <Badge className="bg-blue-500">
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
            <CardTitle>What marine species is this?</CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestionData && (
              <div className="space-y-6">
                {/* Species Image */}
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={currentQuestionData.species.imageUrl}
                      alt="Marine species to identify"
                      className="w-80 h-60 object-cover rounded-lg shadow-lg"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-black/70 text-white">
                        Difficulty {currentQuestionData.species.difficultyLevel}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentQuestionData.options.map((option, index) => {
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
                      buttonClass += " hover:bg-blue-50 border-gray-200";
                    }

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className={buttonClass}
                        onClick={() => !isAnswered && handleAnswer(option)}
                        disabled={isAnswered}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {showResult && option === currentQuestionData.correctAnswer && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {showResult && option === selectedAnswer && option !== currentQuestionData.correctAnswer && (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
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
                      <div className="text-sm text-green-700">
                        +{pointsPerCorrect} points
                        {streak >= 3 && ` + ${Math.floor(streak / 3) * 25} streak bonus`}
                        {timeLeft > 10 && ' + 25 time bonus'}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 mt-2">
                      <strong>{currentQuestionData.species.name}</strong> - {currentQuestionData.species.scientificName}
                      <br />
                      {currentQuestionData.species.funFact}
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