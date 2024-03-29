import { CreditsMovies } from "./people";

/* ----------------------- TMDB Models ----------------------- */

export type ApiResultMovies = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type Collection = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
};

export type Genre = {
  id: number;
  name: string;
};

export type Image = {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: string;
  vote_average: number;
  vote_count: number;
  width: number;
};

export type Movie = {
  adulte: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export interface MovieDetails extends Movie {
  belongs_to_collection: Collection;
  budget: number;
  credits: CreditsMovies;
  genres: Genre[];
  homepage: string;
  images: {
    backdrops: Image[];
    id: number;
    logos: Image[];
    posters: Image[];
  };
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  similar: {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };
  status: string;
  tagline: string;
  videos: {
    id: number;
    results: Video[];
  };
  watch_providers_fr: WatchProviderFr[];
}

export type ProductionCompany = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
};

export type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

export type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type Video = {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
};

export type WatchProviderFr = {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
};

/* ----------------------- Internal Models ----------------------- */

export type InternalMovie = {
  _id: string;
  runtime: number;
  title: string;
  release_date: string;
  genres: string[];
  poster_path: string;
  overview: string;
  tmdb_id: number;
};

export type InternalMovieUser = {
  _id: string;
  movie: InternalMovie;
  account_states: {
    status: "watched" | "to_watch";
  };
};

export type AddMovie = {
  title: string;
  runtime: number;
  releaseDate: string;
  genres: string[];
  posterPath: string;
  overview: string;
  tmdbId: number;
};

export type CreateMovieStatus = {
  movieId: string;
  userId: string;
  userName: string;
  status: "watched" | "to_watch";
};

export type AddMovieStatus = {
  userMovieId: string;
  movieId: string;
  status: "watched" | "to_watch";
};
