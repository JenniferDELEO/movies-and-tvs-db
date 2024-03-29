import {
  Genre,
  Image,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  Video,
  WatchProviderFr,
} from "./movies";
import { CastMovies, CastTvs, CreditsTvs, CrewTvs } from "./people";

export type ApiResultTvs = {
  page: number;
  results: Tv[];
  total_pages: number;
  total_results: number;
};

export type CreatedBy = {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
};

export type Episode = {
  air_date: string;
  crew: CrewTvs[];
  episode_number: number;
  guest_stars: CastMovies[];
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
};

export interface EpisodeDetails extends Episode {
  credits: {
    id: number;
    cast: CastTvs[];
    crew: CrewTvs[];
    guest_stars: CastMovies[];
  };
  images: {
    id: number;
    stills: Image[];
  };
  videos: {
    id: number;
    results: Video[];
  };
}

export type EpisodeToAir = {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
};

export type Network = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
};

export type Season = {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
};

export type SeasonDetails = {
  _id: string;
  aggregate_credits: {
    id: number;
    cast: CastTvs[];
    crew: CrewTvs[];
  };
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
};

export type Tv = {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
};

export interface TvDetails extends Tv {
  aggregate_credits: CreditsTvs;
  created_by: CreatedBy[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  images: {
    backdrops: Image[];
    id: number;
    logos: Image[];
    posters: Image[];
  };
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: EpisodeToAir;
  next_episode_to_air: EpisodeToAir | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  similar: {
    page: number;
    results: Tv[];
    total_pages: number;
    total_results: number;
  };
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  videos: {
    id: number;
    results: Video[];
  };
  watch_providers_fr: WatchProviderFr[];
}

/* ----------------------- Internal Models TVs ----------------------- */

export type InternalTv = {
  _id: string;
  title: string;
  number_of_seasons: number;
  number_of_episodes: number;
  release_date: string;
  total_runtime: number;
  genres: string[];
  poster_path: string;
  overview: string;
  tmdb_id: number;
};

export type InternalTvAndUser = {
  _id: string;
  user_name: string;
  tv_title: string;
  tv: InternalTv;
  account_states: {
    status: "active" | "archived" | "to_discover";
    watch_state: "started" | "finished" | "to_watch";
  };
};

export type AddTv = {
  tmdbId: number;
  title: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  releaseDate: string;
  totalRuntime: number;
  genres: string[];
  posterPath: string;
  overview: string;
};

export type UpdateTv = {
  tvId: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  totalRuntime: number;
};

export type CreateTvStatus = {
  userId: string;
  userName: string;
  tvId: string;
  tvTitle: string;
  status: "active" | "archived" | "to_discover";
  watchState: "started" | "finished" | "to_watch";
};

export type AddTvStatus = {
  userTvId: string;
  status: "active" | "archived" | "to_discover";
  watchState: "started" | "finished" | "to_watch";
};
