'use client';

import React, { useState, useEffect, JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Star, CheckCircle, XCircle, Brain, Lightbulb } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

interface MarineTriviaGameProps {
  onComplete: (score: number, correctAnswers: number, totalQuestions: number, completionTime: number) => void;
  onExit: () => void;
}

interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
  category: string;
}

export function MarineTriviaGame({ onComplete, onExit }: MarineTriviaGameProps): JSX.Element {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [streak, setStreak] = useState(0);

  const { updateUserProgress } = useUserStore();

  const totalQuestions = 15;

  // Marine trivia questions database
  const triviaDatabase: TriviaQuestion[] = [
    {
      id: '1',
      question: 'What percentage of Earth\'s surface is covered by oceans?',
      options: ['65%', '71%', '78%', '82%'],
      correctAnswer: '71%',
      explanation: 'About 71% of Earth\'s surface is covered by oceans, making our planet truly a "blue planet".',
      difficulty: 1,
      category: 'Ocean Facts'
    },
    {
      id: '2',
      question: 'Which marine animal has three hearts?',
      options: ['Octopus', 'Whale', 'Dolphin', 'Shark'],
      correctAnswer: 'Octopus',
      explanation: 'Octopuses have three hearts: two pump blood to the gills, and one pumps blood to the rest of the body.',
      difficulty: 2,
      category: 'Marine Biology'
    },
    {
      id: '3',
      question: 'What is the deepest part of the ocean called?',
      options: ['Mariana Trench', 'Puerto Rico Trench', 'Japan Trench', 'Tonga Trench'],
      correctAnswer: 'Mariana Trench',
      explanation: 'The Mariana Trench in the Pacific Ocean reaches depths of about 36,200 feet (11,034 meters).',
      difficulty: 1,
      category: 'Ocean Geography'
    },
    {
      id: '4',
      question: 'Which whale species is known for having the longest migration?',
      options: ['Blue Whale', 'Humpback Whale', 'Gray Whale', 'Sperm Whale'],
      correctAnswer: 'Gray Whale',
      explanation: 'Gray whales migrate up to 12,000 miles round trip between feeding and breeding grounds.',
      difficulty: 2,
      category: 'Marine Mammals'
    },
    {
      id: '5',
      question: 'What do you call a group of fish swimming together?',
      options: ['Herd', 'Flock', 'School', 'Pack'],
      correctAnswer: 'School',
      explanation: 'A group of fish swimming together is called a school, which helps them avoid predators and find food.',
      difficulty: 1,
      category: 'Marine Behavior'
    },
    {
      id: '6',
      question: 'Which marine animal is known to use tools?',
      options: ['Sea Otter', 'Seal', 'Walrus', 'Manatee'],
      correctAnswer: 'Sea Otter',
      explanation: 'Sea otters use rocks as tools to crack open shellfish and other hard-shelled prey.',
      difficulty: 2,
      category: 'Marine Intelligence'
    },
    {
      id: '7',
      question: 'What causes ocean tides?',
      options: ['Wind patterns', 'Moon\'s gravity', 'Earth\'s rotation', 'Temperature changes'],
      correctAnswer: 'Moon\'s gravity',
      explanation: 'Ocean tides are primarily caused by the gravitational pull of the Moon on Earth\'s water.',
      difficulty: 1,
      category: 'Ocean Science'
    },
    {
      id: '8',
      question: 'Which fish can change its gender?',
      options: ['Clownfish', 'Tuna', 'Cod', 'Salmon'],
      correctAnswer: 'Clownfish',
      explanation: 'All clownfish are born male and can change to female when needed for reproduction.',
      difficulty: 2,
      category: 'Fish Biology'
    },
    {
      id: '9',
      question: 'What is the largest structure built by living organisms?',
      options: ['Great Barrier Reef', 'Kelp Forest', 'Coral Triangle', 'Sargasso Sea'],
      correctAnswer: 'Great Barrier Reef',
      explanation: 'The Great Barrier Reef is the largest structure built by living organisms and can be seen from space.',
      difficulty: 1,
      category: 'Coral Reefs'
    },
    {
      id: '10',
      question: 'How do dolphins navigate and hunt?',
      options: ['Echolocation', 'Magnetic fields', 'Star patterns', 'Water currents'],
      correctAnswer: 'Echolocation',
      explanation: 'Dolphins use echolocation, producing clicks and interpreting the returning echoes to navigate and hunt.',
      difficulty: 2,
      category: 'Marine Senses'
    },
    {
      id: '11',
      question: 'Which zone of the ocean receives no sunlight?',
      options: ['Sunlight Zone', 'Twilight Zone', 'Midnight Zone', 'Abyssal Zone'],
      correctAnswer: 'Midnight Zone',
      explanation: 'The Midnight Zone (bathypelagic zone) begins at about 1,000 meters deep where no sunlight penetrates.',
      difficulty: 3,
      category: 'Ocean Zones'
    },
    {
      id: '12',
      question: 'What is bioluminescence?',
      options: ['Heat production', 'Light production', 'Sound production', 'Electricity production'],
      correctAnswer: 'Light production',
      explanation: 'Bioluminescence is the production of light by living organisms, common in deep-sea creatures.',
      difficulty: 2,
      category: 'Marine Phenomena'
    },
    {
      id: '13',
      question: 'Which sea turtle species is the largest?',
      options: ['Green Sea Turtle', 'Loggerhead', 'Leatherback', 'Hawksbill'],
      correctAnswer: 'Leatherback',
      explanation: 'Leatherback sea turtles can weigh up to 2,000 pounds and are the largest of all sea turtle species.',
      difficulty: 2,
      category: 'Sea Turtles'
    },
    {
      id: '14',
      question: 'What creates the "midnight zone" in the ocean?',
      options: ['Cold temperatures', 'High pressure', 'Lack of sunlight', 'Lack of oxygen'],
      correctAnswer: 'Lack of sunlight',
      explanation: 'The midnight zone is defined by the complete absence of sunlight below 1,000 meters depth.',
      difficulty: 3,
      category: 'Ocean Physics'
    },
    {
      id: '15',
      question: 'Which marine animal has the most powerful bite?',
      options: ['Great White Shark', 'Saltwater Crocodile', 'Orca', 'Giant Squid'],
      correctAnswer: 'Saltwater Crocodile',
      explanation: 'Saltwater crocodiles have the strongest bite force of any marine animal at over 3,700 PSI.',
      difficulty: 3,
      category: 'Marine Predators'
    },
    {
      id: '16',
      question: 'How many chambers does a whale\'s heart have?',
      options: ['2', '3', '4', '5'],
      correctAnswer: '4',
      explanation: 'Like all mammals, whales have four-chambered hearts that efficiently pump blood throughout their massive bodies.',
      difficulty: 2,
      category: 'Whale Anatomy'
    },
    {
      id: '17',
      question: 'What is the fastest marine animal?',
      options: ['Sailfish', 'Marlin', 'Tuna', 'Dolphin'],
      correctAnswer: 'Sailfish',
      explanation: 'Sailfish can reach speeds of up to 68 mph, making them the fastest fish in the ocean.',
      difficulty: 2,
      category: 'Marine Speed'
    },
    {
      id: '18',
      question: 'Which coral type builds most coral reefs?',
      options: ['Soft coral', 'Hard coral', 'Sea fans', 'Brain coral'],
      correctAnswer: 'Hard coral',
      explanation: 'Hard corals with calcium carbonate skeletons are the primary reef builders in tropical oceans.',
      difficulty: 2,
      category: 'Coral Biology'
    },
    {
      id: '19',
      question: 'What do baleen whales primarily eat?',
      options: ['Fish', 'Squid', 'Krill', 'Seals'],
      correctAnswer: 'Krill',
      explanation: 'Baleen whales filter-feed primarily on krill and other small planktonic organisms.',
      difficulty: 1,
      category: 'Whale Diet'
    },
    {
      id: '20',
      question: 'Which ocean current helps regulate Earth\'s climate?',
      options: ['Gulf Stream', 'California Current', 'Kuroshio Current', 'Antarctic Current'],
      correctAnswer: 'Gulf Stream',
      explanation: 'The Gulf Stream carries warm water northward, significantly influencing climate in the North Atlantic.',
      difficulty: 3,
      category: 'Ocean Currents'
    }
  ];

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted, showResult]);

  const generateQuestions = (): void => {
    const shuffled = [...triviaDatabase].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, totalQuestions));
  };

  const startGame = (): void => {
    generateQuestions();
    setGameStarted(true);
    setGameStartTime(Date.now());
    setTimeLeft(25);
    setCurrentQuestion(0);
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
  };

  const handleAnswer = (answer: string): void => {
    setSelectedAnswer(answer);
    const currentQ = questions[currentQuestion];
    const isCorrect = answer === currentQ.correctAnswer;
    
    if (isCorrect) {
      const newStreak = streak + 1;
      const basePoints = currentQ.difficulty * 40;
      const streakBonus = newStreak >= 3 ? Math.floor(newStreak / 3) * 20 : 0;
      const timeBonus = timeLeft > 15 ? 20 : timeLeft > 8 ? 10 : 0;
      
      const points = basePoints + streakBonus + timeBonus;
      
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
        setTimeLeft(25);
      } else {
        finishGame();
      }
    }, 2500);
  };

  const handleTimeUp = (): void => {
    setStreak(0);
    setShowResult(true);
    
    setTimeout(() => {
      setShowResult(false);
      
      if (currentQuestion + 1 < totalQuestions) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(25);
      } else {
        finishGame();
      }
    }, 2500);
  };

  const finishGame = (): void => {
    const completionTime = Date.now() - gameStartTime;
    
    updateUserProgress(score, {
      gameType: 'marine_trivia',
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
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
                <span className="text-3xl">🎯</span>
                <span>Marine Trivia</span>
              </CardTitle>
              <p className="text-gray-600">
                Challenge yourself with fascinating facts about ocean life and marine biology!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Trivia Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-blue-500" />
                    <span>Ocean Facts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-green-500" />
                    <span>Marine Biology</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span>Marine Behavior</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-orange-500" />
                    <span>Ocean Science</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-red-500" />
                    <span>Conservation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-cyan-500" />
                    <span>Marine Mammals</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Game Rules</span>
                  </h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• 15 random trivia questions</li>
                    <li>• 25 seconds per question</li>
                    <li>• Points based on difficulty</li>
                    <li>• Streak & time bonuses</li>
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Scoring</span>
                  </h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Easy: 40 points</li>
                    <li>• Medium: 80 points</li>
                    <li>• Hard: 120 points</li>
                    <li>• Plus bonuses!</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Start Trivia Challenge
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
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
              <Badge className="bg-purple-500">
                Question {currentQuestion + 1} of {totalQuestions}
              </Badge>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold">{score.toLocaleString()}</span>
              </div>
              <Badge variant="secondary" className="bg-gray-100">
                {currentQuestionData?.category}
              </Badge>
              {streak > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  🔥 {streak} streak
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className={`font-semibold ${timeLeft <= 8 ? 'text-red-600' : 'text-gray-900'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {currentQuestionData?.question}
              </CardTitle>
              <Badge 
                variant="outline"
                className={`
                  ${currentQuestionData?.difficulty === 1 ? 'border-green-500 text-green-700' : ''}
                  ${currentQuestionData?.difficulty === 2 ? 'border-yellow-500 text-yellow-700' : ''}
                  ${currentQuestionData?.difficulty === 3 ? 'border-red-500 text-red-700' : ''}
                `}
              >
                {currentQuestionData?.difficulty === 1 ? 'Easy' : 
                 currentQuestionData?.difficulty === 2 ? 'Medium' : 'Hard'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {currentQuestionData && (
              <div className="space-y-4">
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
                      buttonClass += " hover:bg-purple-50 border-gray-200";
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
                          <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
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
                      <div className="text-sm text-green-700 mb-2">
                        +{currentQuestionData.difficulty * 40} base points
                        {streak >= 3 && ` + ${Math.floor(streak / 3) * 20} streak bonus`}
                        {timeLeft > 8 && ' + time bonus'}
                      </div>
                    )}
                    
                    <div className="bg-white/50 p-3 rounded text-sm text-gray-700 mt-3">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <div className="flex-1 text-left">
                          <div className="font-medium mb-1">Did you know?</div>
                          {currentQuestionData.explanation}
                        </div>
                      </div>
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