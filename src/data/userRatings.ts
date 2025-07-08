import { UserRating } from '../types/movie';

export const userRatings: UserRating[] = [
  // User 1 ratings
  { userId: 1, movieId: 1, rating: 5 },
  { userId: 1, movieId: 2, rating: 5 },
  { userId: 1, movieId: 3, rating: 4 },
  { userId: 1, movieId: 8, rating: 5 },
  { userId: 1, movieId: 9, rating: 4 },
  { userId: 1, movieId: 10, rating: 5 },
  
  // User 2 ratings
  { userId: 2, movieId: 1, rating: 4 },
  { userId: 2, movieId: 2, rating: 4 },
  { userId: 2, movieId: 4, rating: 5 },
  { userId: 2, movieId: 7, rating: 5 },
  { userId: 2, movieId: 8, rating: 4 },
  { userId: 2, movieId: 9, rating: 5 },
  
  // User 3 ratings
  { userId: 3, movieId: 3, rating: 5 },
  { userId: 3, movieId: 5, rating: 5 },
  { userId: 3, movieId: 11, rating: 4 },
  { userId: 3, movieId: 12, rating: 4 },
  { userId: 3, movieId: 14, rating: 5 },
  
  // User 4 ratings
  { userId: 4, movieId: 6, rating: 5 },
  { userId: 4, movieId: 10, rating: 5 },
  { userId: 4, movieId: 13, rating: 4 },
  { userId: 4, movieId: 15, rating: 4 },
  { userId: 4, movieId: 1, rating: 4 },
  { userId: 4, movieId: 2, rating: 5 },
  
  // User 5 ratings
  { userId: 5, movieId: 4, rating: 5 },
  { userId: 5, movieId: 7, rating: 5 },
  { userId: 5, movieId: 8, rating: 5 },
  { userId: 5, movieId: 9, rating: 4 },
  { userId: 5, movieId: 15, rating: 5 },
];