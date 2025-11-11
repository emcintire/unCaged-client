export type User = {
  createdAt?: string;
  email: string;
  favorites: Array<string>;
  id: string;
  img: string;
  isAdmin: boolean;
  name: string;
  ratings: Array<UserRating>;
  seen: Array<string>;
  updatedAt?: string;
  watchlist: Array<string>;
};

export type UserRating = {
  movieId: number;
  rating: number;
  createdAt?: string;
};

export type AuthToken = string | null;
