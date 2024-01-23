export type MoviesFilters = {
  certification_country: string;
  include_adult: boolean;
  include_video: boolean;
  language: string;
  page: number;
  "primary_release_date.gte": string | null;
  "primary_release_date.lte": string | null;
  "release_date.lte": string;
  show_me: number;
  sort_by: string;
  "vote_average.gte": number | null;
  "vote_average.lte": number | null;
  "vote_count.gte": number | null;
  watch_region: string;
  with_genres: string | null;
  with_original_language: string | null;
  with_people: string | null;
  "with_runtime.gte": number | null;
  "with_runtime.lte": number | null;
  with_watch_providers: string | null;
  without_genres: string | null;
};

export type TvShowsFilters = {
  "first_air_date.gte": string | null;
  "first_air_date.lte": string | null;
  include_adult: boolean;
  include_video: boolean;
  language: string;
  page: number;
  show_me: number;
  sort_by: string;
  "vote_average.gte": number | null;
  "vote_average.lte": number | null;
  "vote_count.gte": number | null;
  watch_region: string;
  with_genres: string | null;
  with_original_language: string | null;
  "with_runtime.gte": number | null;
  "with_runtime.lte": number | null;
  with_watch_providers: string | null;
  without_genres: string | null;
};
