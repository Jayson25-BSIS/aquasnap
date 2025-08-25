'use client';

import React, { JSX, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, BookOpen, Video, Microscope, ExternalLink, Calendar, Users, Award } from 'lucide-react';

interface MarineLearningHubProps {
  onBack: () => void;
}

interface LearningResource {
  id: string;
  title: string;
  category: 'video' | 'study' | 'research' | 'news';
  description: string;
  url: string;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  date: string;
  views: number;
  icon: string;
}

export function MarineLearningHub({ onBack }: MarineLearningHubProps): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const learningResources: LearningResource[] = [
    {
      id: 'coral-bleaching',
      title: 'Understanding Coral Bleaching: Climate Change Impact',
      category: 'video',
      description: 'Learn how rising ocean temperatures are affecting coral reef ecosystems worldwide.',
      url: 'https://www.youtube.com/watch?v=sEDmJZhYLEA',
      duration: '12:34',
      difficulty: 'intermediate',
      date: '2024-01-15',
      views: 45680,
      icon: '🪸'
    },
    {
      id: 'marine-biodiversity',
      title: 'Recent Study: Marine Biodiversity in Deep Ocean Trenches',
      category: 'study',
      description: 'New discoveries reveal unexpectedly high biodiversity in the deepest parts of our oceans.',
      url: 'https://www.nature.com/articles/s41467-019-09678-z',
      difficulty: 'advanced',
      date: '2024-02-01',
      views: 12450,
      icon: '🔬'
    },
    {
      id: 'whale-migration',
      title: 'Whale Migration Patterns: Latest Research Findings',
      category: 'research',
      description: 'Tracking technology reveals surprising new whale migration routes and behaviors.',
      url: 'https://www.science.org/doi/10.1126/science.aaz9044',
      difficulty: 'intermediate',
      date: '2024-01-28',
      views: 8920,
      icon: '🐋'
    },
    {
      id: 'plastic-pollution',
      title: 'Ocean Plastic Pollution: Breaking News on Cleanup Technologies',
      category: 'news',
      description: 'Latest developments in innovative technologies to remove plastic waste from our oceans.',
      url: 'https://theoceancleanup.com/',
      difficulty: 'beginner',
      date: '2024-02-10',
      views: 67890,
      icon: '🦄'
    },
    {
      id: 'seahorse-conservation',
      title: 'Seahorse Conservation: Success Stories from Marine Protected Areas',
      category: 'video',
      description: 'Documentary showcasing successful seahorse conservation programs around the world.',
      url: 'https://www.youtube.com/watch?v=vN7Il8Om2WA',
      duration: '28:45',
      difficulty: 'beginner',
      date: '2024-01-20',
      views: 23450,
      icon: '🌊'
    },
    {
      id: 'ocean-acidification',
      title: 'Ocean Acidification: New Data from Global Monitoring Stations',
      category: 'study',
      description: 'Comprehensive analysis of ocean pH changes and their impact on marine ecosystems.',
      url: 'https://www.pnas.org/doi/10.1073/pnas.1210201110',
      difficulty: 'advanced',
      date: '2024-02-05',
      views: 15670,
      icon: '🧪'
    },
    {
      id: 'fish-behavior',
      title: 'Schooling Fish Behavior: AI Analysis of Collective Intelligence',
      category: 'research',
      description: 'Machine learning reveals the complex decision-making processes in fish schools.',
      url: 'https://www.science.org/doi/10.1126/science.aay8049',
      difficulty: 'advanced',
      date: '2024-01-25',
      views: 9876,
      icon: '🐠'
    },
    {
      id: 'marine-parks-news',
      title: 'New Marine Protected Areas Established in Pacific Ocean',
      category: 'news',
      description: 'Government announces creation of largest marine sanctuary to protect endangered species.',
      url: 'https://www.noaa.gov/news-release/biden-harris-administration-announces-first-new-national-marine-sanctuaries-in-10-years',
      difficulty: 'beginner',
      date: '2024-02-12',
      views: 34560,
      icon: '🏞️'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: '📚' },
    { id: 'video', name: 'Educational Videos', icon: '📹' },
    { id: 'study', name: 'Scientific Studies', icon: '📄' },
    { id: 'research', name: 'Research Papers', icon: '🔬' },
    { id: 'news', name: 'Latest News', icon: '📰' }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? learningResources 
    : learningResources.filter(resource => resource.category === selectedCategory);

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string): JSX.Element => {
    switch (category) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'research': return <Microscope className="w-4 h-4" />;
      case 'news': return <Calendar className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    } else {
      return `${views} views`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <span className="text-3xl">🌊</span>
                <span>Marine Species Learning Hub</span>
              </CardTitle>
              <p className="text-blue-100 text-lg">
                Explore the latest research, videos, and educational content about marine life and ocean conservation
              </p>
            </CardHeader>
          </Card>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">🔍</span>
                <span>Explore Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-2"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {category.id === 'all' 
                        ? learningResources.length 
                        : learningResources.filter(r => r.category === category.id).length
                      }
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{resource.icon}</span>
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(resource.category)}
                      <span className="text-sm text-gray-600 capitalize">{resource.category}</span>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(resource.difficulty)}>
                    {resource.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">{resource.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(resource.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3" />
                    <span>{formatViews(resource.views)}</span>
                  </div>
                </div>

                {resource.duration && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <Play className="w-4 h-4" />
                    <span>{resource.duration}</span>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={() => window.open(resource.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {resource.category === 'video' ? 'Watch Now' : 'Read More'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Educational Stats */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-green-600" />
                <span>Learning Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {learningResources.length}
                  </div>
                  <div className="text-gray-600">Educational Resources</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {learningResources.filter(r => r.category === 'video').length}
                  </div>
                  <div className="text-gray-600">Video Documentaries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {learningResources.filter(r => r.category === 'study' || r.category === 'research').length}
                  </div>
                  <div className="text-gray-600">Scientific Papers</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                <p className="text-center text-gray-700">
                  <strong>💡 Did you know?</strong> Marine ecosystems produce over 50% of the world's oxygen and 
                  absorb about 30% of carbon dioxide produced by humans. Every species you learn about here 
                  plays a crucial role in maintaining ocean health!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}   