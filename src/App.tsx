import React, { useState, useEffect, useMemo } from 'react';
import { Film, User, TrendingUp } from 'lucide-react';
import { movies } from './data/movies';
import { userRatings as initialUserRatings } from './data/userRatings';
import { RecommendationEngine } from './utils/recommendationEngine';
import { UserRating } from './types/movie';
import HeroSection from './components/HeroSection';
import SearchAndFilter from './components/SearchAndFilter';
import MovieCarousel from './components/MovieCarousel';
import RecommendationSection from './components/RecommendationSection';

const CURRENT_USER_ID = 1;

function App() {
  const [userRatings, setUserRatings] = useState<UserRating[]>(initialUserRatings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('title');
  const [activeTab, setActiveTab] = useState<'browse' | 'recommendations'>('browse');

  // Create recommendation engine
  const recommendationEngine = useMemo(() => {
    return new RecommendationEngine(movies, userRatings);
  }, [userRatings]);

  // Handle user rating
  const handleRate = (movieId: number, rating: number) => {
    setUserRatings(prev => {
      const existingRating = prev.find(r => r.userId === CURRENT_USER_ID && r.movieId === movieId);
      if (existingRating) {
        return prev.map(r => 
          r.userId === CURRENT_USER_ID && r.movieId === movieId 
            ? { ...r, rating }
            : r
        );
      } else {
        return [...prev, { userId: CURRENT_USER_ID, movieId, rating }];
      }
    });
  };

  // Get user ratings as object for easy lookup
  const userRatingsObj = useMemo(() => {
    return userRatings
      .filter(r => r.userId === CURRENT_USER_ID)
      .reduce((acc, r) => ({ ...acc, [r.movieId]: r.rating }), {});
  }, [userRatings]);

  // Get all genres
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach(movie => {
      movie.genre.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  }, []);

  // Filter and sort movies
  const filteredMovies = useMemo(() => {
    let filtered = movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.plot.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.cast.some(actor => actor.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesGenre = selectedGenres.length === 0 || 
                          selectedGenres.some(genre => movie.genre.includes(genre));
      
      return matchesSearch && matchesGenre;
    });

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'year':
          return b.year - a.year;
        case 'rating':
          return b.rating - a.rating;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedGenres, sortBy]);

  // Get recommendations
  const recommendations = useMemo(() => {
    const userRated = userRatings.filter(r => r.userId === CURRENT_USER_ID);
    if (userRated.length === 0) {
      return {
        userBased: [],
        itemBased: [],
        contentBased: [],
        hybrid: []
      };
    }

    return {
      userBased: recommendationEngine.getUserBasedRecommendations(CURRENT_USER_ID, 8),
      itemBased: recommendationEngine.getItemBasedRecommendations(CURRENT_USER_ID, 8),
      contentBased: recommendationEngine.getContentBasedRecommendations(CURRENT_USER_ID, 8),
      hybrid: recommendationEngine.getHybridRecommendations(CURRENT_USER_ID, 8)
    };
  }, [recommendationEngine, userRatings]);

  // Get categorized movies for carousels
  const categorizedMovies = useMemo(() => {
    const trending = movies.filter(m => m.year >= 2015).sort((a, b) => b.rating - a.rating);
    const topRated = movies.filter(m => m.rating >= 8.5).sort((a, b) => b.rating - a.rating);
    const userRated = userRatings
      .filter(r => r.userId === CURRENT_USER_ID)
      .map(r => movies.find(m => m.id === r.movieId))
      .filter(Boolean);

    return {
      trending: trending.slice(0, 10),
      topRated: topRated.slice(0, 10),
      userRated: userRated.slice(0, 10)
    };
  }, [userRatings]);

  // Featured movie for hero section
  const featuredMovie = movies.find(m => m.id === 1) || movies[0];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Film className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-white">CineRecommend</h1>
            </div>
            
            <nav className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('browse')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'browse' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Browse
              </button>
              
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'recommendations' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                For You
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'browse' ? (
          <>
            {/* Hero Section */}
            <HeroSection
              movie={featuredMovie}
              onRate={handleRate}
              userRating={userRatingsObj[featuredMovie.id]}
            />

            {/* Search and Filter */}
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedGenres={selectedGenres}
              onGenreChange={setSelectedGenres}
              sortBy={sortBy}
              onSortChange={setSortBy}
              allGenres={allGenres}
            />

            {/* Movie Carousels */}
            <div className="space-y-8">
              {categorizedMovies.userRated.length > 0 && (
                <MovieCarousel
                  title="Your Rated Movies"
                  movies={categorizedMovies.userRated}
                  onRate={handleRate}
                  userRatings={userRatingsObj}
                />
              )}

              <MovieCarousel
                title="Trending Now"
                movies={categorizedMovies.trending}
                onRate={handleRate}
                userRatings={userRatingsObj}
              />

              <MovieCarousel
                title="Top Rated"
                movies={categorizedMovies.topRated}
                onRate={handleRate}
                userRatings={userRatingsObj}
              />

              {/* Filtered Results */}
              {(searchTerm || selectedGenres.length > 0) && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Search Results ({filteredMovies.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredMovies.map(movie => (
                      <div key={movie.id} className="flex-shrink-0">
                        <div className="w-64 h-96 bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer">
                          <div className="relative h-2/3 overflow-hidden">
                            <img 
                              src={movie.poster} 
                              alt={movie.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          
                          <div className="p-4 h-1/3 flex flex-col justify-between">
                            <div>
                              <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                                {movie.title}
                              </h3>
                              <p className="text-gray-400 text-sm">{movie.year}</p>
                            </div>
                            
                            <div className="flex items-center gap-1 mt-2">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  onClick={() => handleRate(movie.id, star)}
                                  className={`w-4 h-4 ${
                                    userRatingsObj[movie.id] && star <= userRatingsObj[movie.id]
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-600 hover:text-yellow-400'
                                  }`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Personalized Recommendations</h1>
              <p className="text-gray-400">Discover movies tailored to your taste</p>
            </div>

            <RecommendationSection
              userBasedRecommendations={recommendations.userBased}
              itemBasedRecommendations={recommendations.itemBased}
              contentBasedRecommendations={recommendations.contentBased}
              hybridRecommendations={recommendations.hybrid}
              onRate={handleRate}
              userRatings={userRatingsObj}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>© 2024 CineRecommend. Powered by collaborative filtering and machine learning.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;