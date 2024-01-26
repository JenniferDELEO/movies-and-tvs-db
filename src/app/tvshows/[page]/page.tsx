import type { Metadata } from "next";

import TvShowsWrapper from "@/components/ListWrapper/TvShowsWrapper";
import {
  getDiscoverTvShows,
  getGenresTvShows,
  getTvShowsProviders,
} from "@/libs/api/tvshows";

export const metadata: Metadata = {
  title: "Séries TV - Films & Séries TV DB",
};

const TvShows = async () => {
  const { genres: genresTvShows } = await getGenresTvShows();
  const {
    results: tvShows,
    total_pages: totalPagesTvShows,
    total_results: totalResultsTvShows,
  } = await getDiscoverTvShows();
  const { results: providersTvShows } = await getTvShowsProviders();

  return (
    <TvShowsWrapper
      tvShows={tvShows}
      genresTvShows={genresTvShows}
      providersTvShows={providersTvShows}
      totalPagesTvShows={totalPagesTvShows}
      totalResultsTvShows={totalResultsTvShows}
    />
  );
};

export default TvShows;
