import React from 'react';
import { Star, Clock, Calendar } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onRate: (movieId: number, rating: number) => void;
  userRating?: number;
  showRating?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onRate, 
  userRating, 
  showRating = true,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'w-48 h-72',
    medium: 'w-64 h-96',
    large: 'w-80 h-[28rem]'
  };

  const handleStarClick = (rating: number) => {
    onRate(movie.id, rating);
  };

  return (
    <div className={`${sizeClasses[size]} bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer`}>
      <div className="relative h-2/3 overflow-hidden">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          {movie.rating}
        </div>
      </div>
      
      <div className="p-4 h-1/3 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-4 text-gray-400 text-sm mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {movie.year}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {movie.runtime}m
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genre.slice(0, 2).map(genre => (
              <span key={genre} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                {genre}
              </span>
            ))}
          </div>
        </div>
        
        {showRating && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-4 h-4 cursor-pointer transition-colors ${
                  userRating && star <= userRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-600 hover:text-yellow-400'
                }`}
                onClick={() => handleStarClick(star)}
              />
            ))}
            {userRating && (
              <span className="text-xs text-gray-400 ml-1">({userRating}/5)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;