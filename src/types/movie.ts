export interface Movie {
  id: number;
  title: string;
  genre: string[];
  year: number;
  rating: number;
  plot: string;
  cast: string[];
  director: string;
  poster: string;
  runtime: number;
  userRating?: number;
}

export interface UserRating {
  userId: number;
  movieId: number;
  rating: number;
}

export interface User {
  id: number;
  name: string;
  preferences: string[];
}

export interface RecommendationResult {
  movie: Movie;
  score: number;
  reason: string;
}