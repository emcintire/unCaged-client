import type { UserRating } from './userRating';

export type User = {
  _id: string;
  createdOn: string;
  email: string;
  favorites: Array<string>;
  img: string;
  isAdmin: boolean;
  name: string;
  ratings: Array<UserRating>;
  seen: Array<string>;
  watchlist: Array<string>;
};
