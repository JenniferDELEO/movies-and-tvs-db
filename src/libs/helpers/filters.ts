import dayjs from "dayjs";

export const defaultMoviesFilters = {
  certification_country: "FR",
  include_adult: false,
  include_video: false,
  language: "fr-FR",
  page: 1,
  "primary_release_date.gte": null,
  "primary_release_date.lte": null,
  "release_date.lte": dayjs().format("YYYY-MM-DD"),
  show_me: 0,
  sort_by: "popularity.desc",
  "vote_average.gte": 0,
  "vote_average.lte": 10,
  "vote_count.gte": 0,
  watch_region: "FR",
  with_genres: null,
  with_original_language: null,
  with_people: null,
  "with_runtime.gte": 0,
  "with_runtime.lte": 400,
  with_watch_providers: null,
  without_genres: null,
};

export const defaultTvShowsFilters = {
  "first_air_date.gte": null,
  "first_air_date.lte": null,
  include_adult: false,
  include_video: false,
  language: "fr-FR",
  page: 1,
  show_me: 0,
  sort_by: "popularity.desc",
  "vote_average.gte": 0,
  "vote_average.lte": 10,
  "vote_count.gte": 0,
  watch_region: "FR",
  with_genres: null,
  with_original_language: null,
  with_people: null,
  "with_runtime.gte": 0,
  "with_runtime.lte": 400,
  with_watch_providers: null,
  without_genres: null,
};