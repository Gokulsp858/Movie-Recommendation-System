import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onRate: (movieId: number, rating: number) => void;
  userRatings: { [key: number]: number };
  showRating?: boolean;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ 
  title, 
  movies, 
  onRate, 
  userRatings, 
  showRating = true 
}) => {
  const scrollLeft = () => {
    const container = document.getElementById(`carousel-${title}`);
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById(`carousel-${title}`);
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      
      <div className="relative group">
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div
          id={`carousel-${title}`}
          className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map(movie => (
            <div key={movie.id} className="flex-shrink-0">
              <MovieCard
                movie={movie}
                onRate={onRate}
                userRating={userRatings[movie.id]}
                showRating={showRating}
                size="medium"
              />
            </div>
          ))}
        </div>
        
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MovieCarousel;