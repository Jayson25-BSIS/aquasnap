'use client';

import React, { useState, useEffect, JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Star, Heart, Droplets, Sparkles, ShoppingCart, Fish, Waves } from 'lucide-react';
import { useUserStore } from '../store/userStore';

interface FishTankProps {
  onExit: () => void;
}

interface Fish {
  id: string;
  name: string;
  species: string;
  price: number;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  description: string;
  care: {
    foodType: string;
    temperament: string;
    difficulty: number;
  };
}

interface OwnedFish {
  id: string;
  fish: Fish;
  health: number;
  happiness: number;
  hunger: number;
  lastFed: number;
  lastCleaned: number;
  dateAcquired: string;
}

export function FishTank({ onExit }: FishTankProps): JSX.Element {
  const { currentUser, spendPoints } = useUserStore();
  const [ownedFish, setOwnedFish] = useState<OwnedFish[]>([]);
  const [selectedFish, setSelectedFish] = useState<OwnedFish | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [tankCleanliness, setTankCleanliness] = useState(85);
  const [waterQuality, setWaterQuality] = useState(90);
  const [lastTankCleaning, setLastTankCleaning] = useState(Date.now());

  // Available fish in the shop
  const fishShop: Fish[] = [
    {
      id: 'clownfish',
      name: 'Clownfish',
      species: 'Amphiprioninae',
      price: 50,
      icon: '🐠',
      rarity: 'common',
      description: 'Colorful and friendly reef fish, perfect for beginners',
      care: { foodType: 'Algae & plankton', temperament: 'Peaceful', difficulty: 1 }
    },
    {
      id: 'angelfish',
      name: 'Angelfish',
      species: 'Pomacanthidae',
      price: 100,
      icon: '🐟',
      rarity: 'common',
      description: 'Graceful fish with flowing fins',
      care: { foodType: 'Omnivore', temperament: 'Semi-aggressive', difficulty: 2 }
    },
    {
      id: 'seahorse',
      name: 'Seahorse',
      species: 'Hippocampus',
      price: 200,
      icon: '🦄',
      rarity: 'uncommon',
      description: 'Unique and delicate marine creature',
      care: { foodType: 'Small crustaceans', temperament: 'Peaceful', difficulty: 3 }
    },
    {
      id: 'pufferfish',
      name: 'Pufferfish',
      species: 'Tetraodontidae',
      price: 150,
      icon: '🐡',
      rarity: 'uncommon',
      description: 'Round and spiky when threatened',
      care: { foodType: 'Mollusks & crustaceans', temperament: 'Territorial', difficulty: 2 }
    },
    {
      id: 'octopus',
      name: 'Octopus',
      species: 'Octopoda',
      price: 400,
      icon: '🐙',
      rarity: 'rare',
      description: 'Highly intelligent cephalopod',
      care: { foodType: 'Crabs & fish', temperament: 'Solitary', difficulty: 4 }
    },
    {
      id: 'shark',
      name: 'Baby Shark',
      species: 'Carcharhinus',
      price: 300,
      icon: '🦈',
      rarity: 'rare',
      description: 'Young apex predator (grows slowly)',
      care: { foodType: 'Fish & squid', temperament: 'Aggressive', difficulty: 4 }
    },
    {
      id: 'whale',
      name: 'Miniature Whale',
      species: 'Balaenoptera',
      price: 800,
      icon: '🐋',
      rarity: 'legendary',
      description: 'Majestic miniature whale (magical species)',
      care: { foodType: 'Krill & plankton', temperament: 'Gentle giant', difficulty: 5 }
    },
    {
      id: 'jellyfish',
      name: 'Moon Jellyfish',
      species: 'Aurelia aurita',
      price: 120,
      icon: '🪼',
      rarity: 'uncommon',
      description: 'Ethereal and translucent',
      care: { foodType: 'Plankton', temperament: 'Passive', difficulty: 3 }
    }
  ];

  // Load saved fish tank data
  useEffect(() => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedFish = localStorage.getItem('aquasnap_fish_tank');
        const savedCleanliness = localStorage.getItem('aquasnap_tank_cleanliness');
        const savedWaterQuality = localStorage.getItem('aquasnap_water_quality');
        const savedLastCleaning = localStorage.getItem('aquasnap_last_cleaning');

        if (savedFish) {
          setOwnedFish(JSON.parse(savedFish));
        }
        if (savedCleanliness) {
          setTankCleanliness(Number(savedCleanliness));
        }
        if (savedWaterQuality) {
          setWaterQuality(Number(savedWaterQuality));
        }
        if (savedLastCleaning) {
          setLastTankCleaning(Number(savedLastCleaning));
        }
      } catch (error) {
        console.warn('Failed to load fish tank data from localStorage:', error);
      }
    }
  }, []);

  // Save fish tank data
  useEffect(() => {
    // Only save to localStorage in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('aquasnap_fish_tank', JSON.stringify(ownedFish));
        localStorage.setItem('aquasnap_tank_cleanliness', tankCleanliness.toString());
        localStorage.setItem('aquasnap_water_quality', waterQuality.toString());
        localStorage.setItem('aquasnap_last_cleaning', lastTankCleaning.toString());
      } catch (error) {
        console.warn('Failed to save fish tank data to localStorage:', error);
      }
    }
  }, [ownedFish, tankCleanliness, waterQuality, lastTankCleaning]);

  // Update fish status over time
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastCleaning = now - lastTankCleaning;
      const hoursSinceLastCleaning = timeSinceLastCleaning / (1000 * 60 * 60);

      // Decrease tank cleanliness over time
      const cleanlinessDecay = Math.min(hoursSinceLastCleaning * 2, 50);
      const newCleanliness = Math.max(35, 100 - cleanlinessDecay);
      setTankCleanliness(newCleanliness);

      // Water quality affected by cleanliness and fish count
      const fishStress = ownedFish.length * 5;
      const newWaterQuality = Math.max(20, newCleanliness - fishStress);
      setWaterQuality(newWaterQuality);

      // Update fish status
      setOwnedFish(prevFish => 
        prevFish.map(ownedFish => {
          const timeSinceFed = now - ownedFish.lastFed;
          const hoursSinceFed = timeSinceFed / (1000 * 60 * 60);
          
          // Hunger increases over time
          const newHunger = Math.min(100, ownedFish.hunger + hoursSinceFed * 3);
          
          // Health affected by hunger and water quality
          let healthChange = 0;
          if (newHunger > 70) healthChange -= 2;
          if (newWaterQuality < 50) healthChange -= 3;
          if (newWaterQuality > 80) healthChange += 1;
          
          const newHealth = Math.max(0, Math.min(100, ownedFish.health + healthChange));
          
          // Happiness affected by health and cleanliness
          let happinessChange = 0;
          if (newHealth > 80) happinessChange += 2;
          if (newHealth < 30) happinessChange -= 5;
          if (tankCleanliness > 80) happinessChange += 1;
          if (tankCleanliness < 40) happinessChange -= 3;
          
          const newHappiness = Math.max(0, Math.min(100, ownedFish.happiness + happinessChange));

          return {
            ...ownedFish,
            health: newHealth,
            happiness: newHappiness,
            hunger: newHunger
          };
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(updateInterval);
  }, [lastTankCleaning, ownedFish.length, tankCleanliness]);

  // Update selected fish when owned fish changes to ensure real-time UI updates
  useEffect(() => {
    if (selectedFish) {
      const updatedFish = ownedFish.find(fish => fish.id === selectedFish.id);
      if (updatedFish) {
        setSelectedFish(updatedFish);
      }
    }
  }, [ownedFish, selectedFish?.id]);

  const buyFish = (fish: Fish): void => {
    if (!currentUser) {
      console.log('No user logged in');
      return;
    }
    
    if (currentUser.currentSpendablePoints < fish.price) {
      console.log('Not enough points:', { available: currentUser.currentSpendablePoints, needed: fish.price });
      alert(`Not enough points! You need ${fish.price} points but only have ${currentUser.currentSpendablePoints}.`);
      return;
    }
    
    console.log('Attempting to buy fish:', fish.name, 'for', fish.price, 'points');
    
    // Spend points for fish purchase
    const success = spendPoints(fish.price);
    console.log('SpendPoints result:', success);
    
    if (!success) {
      console.log('Failed to spend points');
      alert('Failed to purchase fish. Please try again.');
      return;
    }

    // Add fish to tank
    const newOwnedFish: OwnedFish = {
      id: Date.now().toString(),
      fish,
      health: 100,
      happiness: 80,
      hunger: 30,
      lastFed: Date.now(),
      lastCleaned: Date.now(),
      dateAcquired: new Date().toISOString()
    };

    console.log('Adding fish to tank:', newOwnedFish);
    setOwnedFish(prev => [...prev, newOwnedFish]);
    setShowShop(false);
    alert(`🐠 ${fish.name} added to your aquarium! 🎉`);
  };

  const feedFish = (fishId: string): void => {
    const feedCost = 5;
    if (!currentUser || currentUser.currentSpendablePoints < feedCost) {
      alert(`Not enough points to feed fish! You need ${feedCost} points.`);
      return;
    }
    
    // Spend points for fish feeding
    if (!spendPoints(feedCost)) {
      alert('Failed to feed fish. Please try again.');
      return;
    }

    setOwnedFish(prev =>
      prev.map(fish =>
        fish.id === fishId
          ? {
              ...fish,
              hunger: Math.max(0, fish.hunger - 40),
              happiness: Math.min(100, fish.happiness + 10),
              health: Math.min(100, fish.health + 5),
              lastFed: Date.now()
            }
          : fish
      )
    );
    
    // Update selected fish immediately if it's the one being fed
    if (selectedFish && selectedFish.id === fishId) {
      setSelectedFish(prev => prev ? {
        ...prev,
        hunger: Math.max(0, prev.hunger - 40),
        happiness: Math.min(100, prev.happiness + 10),
        health: Math.min(100, prev.health + 5),
        lastFed: Date.now()
      } : null);
    }
  };

  const feedAllFish = (): void => {
    const feedCost = ownedFish.length * 5;
    if (!currentUser || currentUser.currentSpendablePoints < feedCost) return;
    
    // Spend points for feeding all fish
    if (!spendPoints(feedCost)) return;

    setOwnedFish(prev =>
      prev.map(fish => ({
        ...fish,
        hunger: Math.max(0, fish.hunger - 40),
        happiness: Math.min(100, fish.happiness + 10),
        health: Math.min(100, fish.health + 5),
        lastFed: Date.now()
      }))
    );
  };

  const cleanTank = (): void => {
    const cleanCost = 20;
    if (!currentUser || currentUser.currentSpendablePoints < cleanCost) return;
    
    // Spend points for tank cleaning
    if (!spendPoints(cleanCost)) return;

    setTankCleanliness(95);
    setWaterQuality(95);
    setLastTankCleaning(Date.now());

    // Improve all fish happiness
    setOwnedFish(prev =>
      prev.map(fish => ({
        ...fish,
        happiness: Math.min(100, fish.happiness + 15),
        health: Math.min(100, fish.health + 10),
        lastCleaned: Date.now()
      }))
    );
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'uncommon': return 'bg-green-100 text-green-700 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'legendary': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (value: number): string => {
    if (value >= 80) return 'text-green-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Shop View
  if (showShop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setShowShop(false)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Tank</span>
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-lg">{currentUser?.currentSpendablePoints || 0}</span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-3xl">🛒</span>
                <span>Marine Species Shop</span>
              </CardTitle>
              <p className="text-gray-600">Purchase new fish species for your tank!</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fishShop.map(fish => {
                  const canAfford = currentUser && currentUser.currentSpendablePoints >= fish.price;
                  
                  return (
                    <Card key={fish.id} className="relative">
                      <CardContent className="p-4">
                        <div className="text-center mb-4">
                          <div className="text-6xl mb-2">{fish.icon}</div>
                          <h3 className="font-bold text-lg">{fish.name}</h3>
                          <p className="text-sm text-gray-600 italic">{fish.species}</p>
                        </div>
                        
                        <Badge className={`absolute top-2 right-2 ${getRarityColor(fish.rarity)}`}>
                          {fish.rarity}
                        </Badge>
                        
                        <div className="space-y-3">
                          <p className="text-sm text-gray-700">{fish.description}</p>
                          
                          <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
                            <div><strong>Diet:</strong> {fish.care.foodType}</div>
                            <div><strong>Temperament:</strong> {fish.care.temperament}</div>
                            <div className="flex items-center justify-between">
                              <strong>Care Difficulty:</strong>
                              <div className="flex space-x-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < fish.care.difficulty ? 'bg-red-400' : 'bg-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-bold text-lg">{fish.price}</span>
                            </div>
                            
                            <Button
                              onClick={() => buyFish(fish)}
                              disabled={!canAfford}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              {canAfford ? 'Buy' : 'Not enough points'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Tank View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onExit}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-lg">{currentUser?.totalPoints || 0}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Fish Tank */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl">🐠</span>
                  <span>My Aquarium</span>
                </div>
                <Button
                  onClick={() => setShowShop(true)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Fish Shop
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Tank Status */}
              <div className="bg-blue-900 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 text-white text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <Sparkles className="w-4 h-4" />
                        <span>Cleanliness</span>
                      </span>
                      <span className={getStatusColor(tankCleanliness)}>{tankCleanliness}%</span>
                    </div>
                    <Progress value={tankCleanliness} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <Droplets className="w-4 h-4" />
                        <span>Water Quality</span>
                      </span>
                      <span className={getStatusColor(waterQuality)}>{waterQuality}%</span>
                    </div>
                    <Progress value={waterQuality} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Tank Actions */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button
                  onClick={feedAllFish}
                  disabled={ownedFish.length === 0 || !currentUser || currentUser.currentSpendablePoints < ownedFish.length * 5}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Fish className="w-4 h-4 mr-2" />
                  Feed All ({ownedFish.length * 5} pts)
                </Button>
                
                <Button
                  onClick={cleanTank}
                  disabled={!currentUser || currentUser.currentSpendablePoints < 20}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  <Waves className="w-4 h-4 mr-2" />
                  Clean Tank (20 pts)
                </Button>
              </div>

              {/* Fish Display */}
              <div className="bg-gradient-to-b from-cyan-200 to-blue-400 rounded-lg p-6 min-h-96 relative overflow-hidden">
                {/* Water effects */}
                <div className="absolute inset-0 bg-blue-400 opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-yellow-600 opacity-40"></div>
                
                {/* Bubbles effect */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full opacity-60 animate-bounce"></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full opacity-50 animate-bounce delay-300"></div>
                <div className="absolute top-12 left-16 w-1.5 h-1.5 bg-white rounded-full opacity-70 animate-bounce delay-700"></div>

                {ownedFish.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🌊</div>
                      <p className="text-lg">Your tank is empty!</p>
                      <p className="text-sm opacity-80">Visit the fish shop to add some marine friends!</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {ownedFish.map((ownedFish, index) => (
                      <div
                        key={ownedFish.id}
                        className={`text-center cursor-pointer transform transition-all hover:scale-110 ${
                          selectedFish?.id === ownedFish.id ? 'scale-125 brightness-110' : ''
                        }`}
                        onClick={() => setSelectedFish(selectedFish?.id === ownedFish.id ? null : ownedFish)}
                        style={{
                          animation: `swim${(index % 3) + 1} ${3 + (index % 2)}s infinite ease-in-out`,
                          animationDelay: `${index * 0.5}s`
                        }}
                      >
                        <div className="text-4xl md:text-5xl mb-1">{ownedFish.fish.icon}</div>
                        <div className="text-xs text-white font-medium">
                          {ownedFish.fish.name}
                        </div>
                        {/* Health indicator */}
                        <div className="flex justify-center mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            ownedFish.health >= 80 ? 'bg-green-400' :
                            ownedFish.health >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fish Details / Tank Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">📊</span>
                <span>{selectedFish ? 'Fish Details' : 'Tank Overview'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedFish ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl mb-2">{selectedFish.fish.icon}</div>
                    <h3 className="font-bold text-lg">{selectedFish.fish.name}</h3>
                    <p className="text-sm text-gray-600 italic">{selectedFish.fish.species}</p>
                    <Badge className={`mt-2 ${getRarityColor(selectedFish.fish.rarity)}`}>
                      {selectedFish.fish.rarity}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1 text-sm">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>Health</span>
                        </span>
                        <span className={`text-sm font-semibold ${getStatusColor(selectedFish.health)}`}>
                          {selectedFish.health}%
                        </span>
                      </div>
                      <Progress value={selectedFish.health} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1 text-sm">
                          <span className="text-yellow-500">😊</span>
                          <span>Happiness</span>
                        </span>
                        <span className={`text-sm font-semibold ${getStatusColor(selectedFish.happiness)}`}>
                          {selectedFish.happiness}%
                        </span>
                      </div>
                      <Progress value={selectedFish.happiness} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1 text-sm">
                          <span className="text-orange-500">🍽️</span>
                          <span>Hunger</span>
                        </span>
                        <span className={`text-sm font-semibold ${getStatusColor(100 - selectedFish.hunger)}`}>
                          {selectedFish.hunger}%
                        </span>
                      </div>
                      <Progress value={selectedFish.hunger} className="h-2" />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                    <div><strong>Diet:</strong> {selectedFish.fish.care.foodType}</div>
                    <div><strong>Temperament:</strong> {selectedFish.fish.care.temperament}</div>
                    <div><strong>Acquired:</strong> {new Date(selectedFish.dateAcquired).toLocaleDateString()}</div>
                  </div>

                  <Button
                    onClick={() => feedFish(selectedFish.id)}
                    disabled={!currentUser || currentUser.currentSpendablePoints < 5}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    <Fish className="w-4 h-4 mr-2" />
                    Feed Fish (5 pts)
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{ownedFish.length}</div>
                      <div className="text-sm text-gray-600">Fish</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {ownedFish.reduce((sum, fish) => sum + fish.fish.price, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Value</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Tank Care Tips:</h4>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-500">💡</span>
                        <span>Clean your tank regularly to keep fish healthy</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-orange-500">🍽️</span>
                        <span>Feed fish when they get hungry</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-green-500">❤️</span>
                        <span>Happy fish live longer and are more colorful</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-purple-500">⭐</span>
                        <span>Collect rare species for bragging rights!</span>
                      </div>
                    </div>
                  </div>

                  {ownedFish.length > 0 && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Recent Activity:</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Last tank cleaning: {new Date(lastTankCleaning).toLocaleString()}</div>
                        <div>Avg. fish health: {Math.round(ownedFish.reduce((sum, f) => sum + f.health, 0) / ownedFish.length)}%</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom CSS for swimming animations */}
      <style jsx>{`
        @keyframes swim1 {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(15px) translateY(-8px) rotate(-3deg); }
          50% { transform: translateX(25px) translateY(0px) rotate(0deg); }
          75% { transform: translateX(10px) translateY(8px) rotate(3deg); }
        }
        
        @keyframes swim2 {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
          20% { transform: translateX(-8px) translateY(12px) rotate(-8deg) scale(1.05); }
          40% { transform: translateX(18px) translateY(-6px) rotate(5deg) scale(1.1); }
          60% { transform: translateX(-12px) translateY(15px) rotate(-2deg) scale(0.95); }
          80% { transform: translateX(20px) translateY(-10px) rotate(6deg) scale(1.02); }
        }
        
        @keyframes swim3 {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          33% { transform: translateY(-15px) scale(1.15) rotate(-4deg); }
          66% { transform: translateY(12px) scale(0.9) rotate(4deg); }
        }
      `}</style>
    </div>
  );
}