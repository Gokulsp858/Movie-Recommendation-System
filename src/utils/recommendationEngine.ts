import { Movie, UserRating, RecommendationResult } from '../types/movie';

export class RecommendationEngine {
  private movies: Movie[];
  private userRatings: UserRating[];

  constructor(movies: Movie[], userRatings: UserRating[]) {
    this.movies = movies;
    this.userRatings = userRatings;
  }

  // Calculate cosine similarity between two users
  private calculateUserSimilarity(user1Id: number, user2Id: number): number {
    const user1Ratings = this.userRatings.filter(r => r.userId === user1Id);
    const user2Ratings = this.userRatings.filter(r => r.userId === user2Id);

    // Find common movies
    const commonMovies = user1Ratings.filter(r1 => 
      user2Ratings.some(r2 => r2.movieId === r1.movieId)
    );

    if (commonMovies.length === 0) return 0;

    // Calculate cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    commonMovies.forEach(r1 => {
      const r2 = user2Ratings.find(r => r.movieId === r1.movieId);
      if (r2) {
        dotProduct += r1.rating * r2.rating;
        norm1 += r1.rating * r1.rating;
        norm2 += r2.rating * r2.rating;
      }
    });

    if (norm1 === 0 || norm2 === 0) return 0;

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Calculate item-based similarity between two movies
  private calculateItemSimilarity(movie1Id: number, movie2Id: number): number {
    const movie1Ratings = this.userRatings.filter(r => r.movieId === movie1Id);
    const movie2Ratings = this.userRatings.filter(r => r.movieId === movie2Id);

    // Find common users
    const commonUsers = movie1Ratings.filter(r1 => 
      movie2Ratings.some(r2 => r2.userId === r1.userId)
    );

    if (commonUsers.length === 0) return 0;

    // Calculate cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    commonUsers.forEach(r1 => {
      const r2 = movie2Ratings.find(r => r.userId === r1.userId);
      if (r2) {
        dotProduct += r1.rating * r2.rating;
        norm1 += r1.rating * r1.rating;
        norm2 += r2.rating * r2.rating;
      }
    });

    if (norm1 === 0 || norm2 === 0) return 0;

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // User-based collaborative filtering
  getUserBasedRecommendations(userId: number, limit: number = 10): RecommendationResult[] {
    const userRated = this.userRatings.filter(r => r.userId === userId);
    const userRatedMovieIds = userRated.map(r => r.movieId);

    // Calculate similarity with all other users
    const allUserIds = [...new Set(this.userRatings.map(r => r.userId))];
    const similarUsers = allUserIds
      .filter(id => id !== userId)
      .map(id => ({
        userId: id,
        similarity: this.calculateUserSimilarity(userId, id)
      }))
      .filter(u => u.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity);

    // Get recommendations from similar users
    const recommendations = new Map<number, { score: number; count: number }>();

    similarUsers.forEach(({ userId: similarUserId, similarity }) => {
      const similarUserRatings = this.userRatings.filter(r => 
        r.userId === similarUserId && 
        !userRatedMovieIds.includes(r.movieId) &&
        r.rating >= 4
      );

      similarUserRatings.forEach(rating => {
        const current = recommendations.get(rating.movieId) || { score: 0, count: 0 };
        recommendations.set(rating.movieId, {
          score: current.score + (rating.rating * similarity),
          count: current.count + 1
        });
      });
    });

    // Convert to results and sort by score
    const results: RecommendationResult[] = [];
    recommendations.forEach((data, movieId) => {
      const movie = this.movies.find(m => m.id === movieId);
      if (movie) {
        results.push({
          movie,
          score: data.score / data.count,
          reason: "Based on users with similar taste"
        });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Item-based collaborative filtering
  getItemBasedRecommendations(userId: number, limit: number = 10): RecommendationResult[] {
    const userRated = this.userRatings.filter(r => r.userId === userId && r.rating >= 4);
    const userRatedMovieIds = userRated.map(r => r.movieId);

    const recommendations = new Map<number, { score: number; count: number }>();

    userRated.forEach(({ movieId, rating }) => {
      // Find similar movies
      const unratedMovies = this.movies.filter(m => !userRatedMovieIds.includes(m.id));
      
      unratedMovies.forEach(movie => {
        const similarity = this.calculateItemSimilarity(movieId, movie.id);
        if (similarity > 0) {
          const current = recommendations.get(movie.id) || { score: 0, count: 0 };
          recommendations.set(movie.id, {
            score: current.score + (rating * similarity),
            count: current.count + 1
          });
        }
      });
    });

    // Convert to results and sort by score
    const results: RecommendationResult[] = [];
    recommendations.forEach((data, movieId) => {
      const movie = this.movies.find(m => m.id === movieId);
      if (movie) {
        results.push({
          movie,
          score: data.score / data.count,
          reason: "Because you liked similar movies"
        });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Content-based recommendations by genre
  getContentBasedRecommendations(userId: number, limit: number = 10): RecommendationResult[] {
    const userRated = this.userRatings.filter(r => r.userId === userId && r.rating >= 4);
    const userRatedMovieIds = userRated.map(r => r.movieId);

    // Get user's preferred genres
    const genreScores = new Map<string, number>();
    userRated.forEach(rating => {
      const movie = this.movies.find(m => m.id === rating.movieId);
      if (movie) {
        movie.genre.forEach(genre => {
          genreScores.set(genre, (genreScores.get(genre) || 0) + rating.rating);
        });
      }
    });

    // Find unrated movies with preferred genres
    const unratedMovies = this.movies.filter(m => !userRatedMovieIds.includes(m.id));
    
    const results: RecommendationResult[] = unratedMovies.map(movie => {
      let score = 0;
      movie.genre.forEach(genre => {
        score += genreScores.get(genre) || 0;
      });
      
      return {
        movie,
        score: score / movie.genre.length,
        reason: `Because you enjoy ${movie.genre.join(', ')} movies`
      };
    });

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Hybrid recommendations combining multiple approaches
  getHybridRecommendations(userId: number, limit: number = 10): RecommendationResult[] {
    const userBased = this.getUserBasedRecommendations(userId, 5);
    const itemBased = this.getItemBasedRecommendations(userId, 5);
    const contentBased = this.getContentBasedRecommendations(userId, 5);

    const combinedMap = new Map<number, RecommendationResult>();

    // Combine recommendations with weights
    [
      { results: userBased, weight: 0.4 },
      { results: itemBased, weight: 0.4 },
      { results: contentBased, weight: 0.2 }
    ].forEach(({ results, weight }) => {
      results.forEach(result => {
        const existing = combinedMap.get(result.movie.id);
        if (existing) {
          existing.score += result.score * weight;
        } else {
          combinedMap.set(result.movie.id, {
            ...result,
            score: result.score * weight,
            reason: "Personalized recommendation"
          });
        }
      });
    });

    return Array.from(combinedMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}