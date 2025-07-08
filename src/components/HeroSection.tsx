import React from 'react';
import { Play, Info, Star } from 'lucide-react';
import { Movie } from '../types/movie';

interface HeroSectionProps {
  movie: Movie;
  onRate: (movieId: number, rating: number) => void;
  userRating?: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie, onRate, userRating }) => {
  return (
    <div className="relative h-[70vh] mb-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-white mb-4">{movie.title}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-white font-semibold">{movie.rating}</span>
            </div>
            <span className="text-gray-300">{movie.year}</span>
            <span className="text-gray-300">{movie.runtime}m</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genre.map(genre => (
              <span key={genre} className="bg-gray-800/70 text-white px-3 py-1 rounded-full text-sm">
                {genre}
              </span>
            ))}
          </div>

          <p className="text-gray-200 text-lg mb-6 line-clamp-3">{movie.plot}</p>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              <Play className="w-5 h-5" />
              Play
            </button>
            
            <button className="flex items-center gap-2 bg-gray-700/80 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600/80 transition-colors">
              <Info className="w-5 h-5" />
              More Info
            </button>

            <div className="flex items-center gap-1 ml-4">
              <span className="text-white text-sm mr-2">Rate:</span>
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-5 h-5 cursor-pointer transition-colors ${
                    userRating && star <= userRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400 hover:text-yellow-400'
                  }`}
                  onClick={() => onRate(movie.id, star)}
                />
              ))}
              {userRating && (
                <span className="text-gray-400 text-sm ml-2">({userRating}/5)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;