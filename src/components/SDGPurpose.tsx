'use client';

import React, { JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Target, BookOpen, Users, Award, Globe } from 'lucide-react';

export function SDGPurpose(): JSX.Element {
  const sdgGoals = [
    {
      number: "14",
      title: "Life Below Water",
      description: "Conserve and sustainably use the oceans, seas and marine resources",
      icon: "🌊",
      impact: "Primary Focus"
    },
    {
      number: "4",
      title: "Quality Education",
      description: "Ensure inclusive and equitable quality education for all",
      icon: "📚",
      impact: "Educational Platform"
    },
    {
      number: "17",
      title: "Partnerships",
      description: "Strengthen global partnerships for sustainable development",
      icon: "🤝",
      impact: "Community Building"
    }
  ];

  const impacts = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "Marine Education",
      description: "Interactive learning about 100+ marine species, habitats, and conservation status"
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Global Awareness",
      description: "Raising consciousness about ocean pollution, climate change, and marine biodiversity"
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      title: "Behavioral Change",
      description: "Inspiring sustainable practices through gamified conservation experiences"
    },
    {
      icon: <Globe className="w-6 h-6 text-orange-600" />,
      title: "Ecosystem Understanding",
      description: "Teaching marine food webs, ocean currents, and ecosystem interdependencies"
    }
  ];

  return (
    <div className="w-full py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Purpose Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Waves className="w-8 h-8 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
            <Waves className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            AQUASNAP transforms marine conservation education into an engaging, gamified experience 
            that aligns with the <span className="font-semibold text-blue-600">UN Sustainable Development Goals</span>, 
            fostering a new generation of ocean advocates through interactive learning.
          </p>
        </div>

        {/* SDG Alignment Cards */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Aligned with UN Sustainable Development Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sdgGoals.map((goal, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center pb-2">
                  <div className="text-4xl mb-2">{goal.icon}</div>
                  <Badge className="mb-2 bg-blue-600 text-white">
                    SDG {goal.number}
                  </Badge>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {goal.impact}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Impact Areas */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Creating Real-World Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {impacts.map((impact, index) => (
              <Card key={index} className="border-l-4 border-blue-500 hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {impact.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">
                        {impact.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {impact.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Statistics */}
        <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-8">
              AQUASNAP By The Numbers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">🐠 8</div>
                <p className="text-sm opacity-90">Interactive Games</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">🌊 50+</div>
                <p className="text-sm opacity-90">Marine Species</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">📚 100+</div>
                <p className="text-sm opacity-90">Educational Resources</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">🏆 10</div>
                <p className="text-sm opacity-90">Achievement Levels</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg border">
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-3">
              Join the Movement
            </h4>
            <p className="text-gray-600 mb-4">
              Every game played, every species learned, and every fish rescued in AQUASNAP 
              contributes to building a more ocean-conscious global community.
            </p>
            <p className="text-sm text-blue-600 font-medium">
              Together, we can protect our blue planet, one wave at a time 🌊
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}