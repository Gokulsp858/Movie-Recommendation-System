import React from 'react';
import { Lightbulb, Users, Film, Sparkles } from 'lucide-react';
import { RecommendationResult } from '../types/movie';
import MovieCard from './MovieCard';

interface RecommendationSectionProps {
  userBasedRecommendations: RecommendationResult[];
  itemBasedRecommendations: RecommendationResult[];
  contentBasedRecommendations: RecommendationResult[];
  hybridRecommendations: RecommendationResult[];
  onRate: (movieId: number, rating: number) => void;
  userRatings: { [key: number]: number };
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  userBasedRecommendations,
  itemBasedRecommendations,
  contentBasedRecommendations,
  hybridRecommendations,
  onRate,
  userRatings
}) => {
  const sections = [
    {
      title: "Top Picks For You",
      icon: <Sparkles className="w-5 h-5" />,
      recommendations: hybridRecommendations,
      description: "Our best recommendations based on your taste"
    },
    {
      title: "Because You Liked Similar Movies",
      icon: <Film className="w-5 h-5" />,
      recommendations: itemBasedRecommendations,
      description: "Movies similar to ones you've enjoyed"
    },
    {
      title: "Users Like You Also Watched",
      icon: <Users className="w-5 h-5" />,
      recommendations: userBasedRecommendations,
      description: "Popular among users with similar taste"
    },
    {
      title: "More Movies You Might Like",
      icon: <Lightbulb className="w-5 h-5" />,
      recommendations: contentBasedRecommendations,
      description: "Based on your favorite genres"
    }
  ];

  return (
    <div className="space-y-8">
      {sections.map(({ title, icon, recommendations, description }) => (
        <div key={title} className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-red-400">
              {icon}
            </div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
          <p className="text-gray-400 mb-4">{description}</p>
          
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recommendations.slice(0, 5).map(({ movie, score, reason }) => (
                <div key={movie.id} className="relative">
                  <MovieCard
                    movie={movie}
                    onRate={onRate}
                    userRating={userRatings[movie.id]}
                    showRating={true}
                    size="medium"
                  />
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    {Math.round(score * 10)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              Rate more movies to get better recommendations
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecommendationSection;