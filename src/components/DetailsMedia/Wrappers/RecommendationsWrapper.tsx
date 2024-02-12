/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useParams } from "next/navigation";
import React, { FC, useEffect, useState } from "react";

import {
  Genre,
  InternalMovie,
  InternalMovieUser,
  Movie,
} from "@/models/movies";
import { TvShow } from "@/models/tvShows";
import Card from "../../Cards/Card";
import Pagination from "../../Pagination/Pagination";
import { getRecommendationsMovie } from "@/libs/api/movies";
import { getRecommendationsTvShow } from "@/libs/api/tvshows";
import { TmdbFetcher } from "@/libs/helpers/TmdbFetcher";

type Props = {
  mediaId: string;

  genresMovies?: Genre[];
  recommendationsMovies?: Movie[];
  totalPagesRecommendationsMovies?: number;
  totalResultsRecommendationsMovies?: number;
  genresTvShows?: Genre[];
  recommendationsTvShows?: TvShow[];
  totalPagesRecommendationsTvShows?: number;
  totalResultsRecommendationsTvShows?: number;
  userMovies?: InternalMovieUser[];
  userMoviesId?: string;
  internalMovies?: InternalMovie[];
};

const RecommendationsWrapper: FC<Props> = (props) => {
  const {
    mediaId,

    genresMovies,
    recommendationsMovies,
    totalPagesRecommendationsMovies,
    totalResultsRecommendationsMovies,
    genresTvShows,
    recommendationsTvShows,
    totalPagesRecommendationsTvShows,
    totalResultsRecommendationsTvShows,
    userMovies,
    userMoviesId,
    internalMovies,
  } = props;
  const params = useParams();

  const [moviesList, setMoviesList] = useState<Movie[]>(
    recommendationsMovies || [],
  );
  const [tvShowsList, setTvShowsList] = useState<TvShow[]>(
    recommendationsTvShows || [],
  );
  const [totalPages, setTotalPages] = useState<number>(
    totalPagesRecommendationsMovies || totalPagesRecommendationsTvShows || 0,
  );
  const [totalResults, setTotalResults] = useState<number>(
    totalResultsRecommendationsMovies ||
      totalResultsRecommendationsTvShows ||
      0,
  );
  const [currentPage, setCurrentPage] = useState<number>(Number(params.page));

  const genres = genresMovies || genresTvShows || [];

  const {
    fetchUserDatas,
    favoriteMoviesIds,
    watchlistMoviesIds,
    favoriteTvShowsIds,
    watchlistTvShowsIds,
    ratedMovies,
    ratedTvShows,
    ratedMoviesIds,
    ratedTvShowsIds,
    userLists,
  } = TmdbFetcher();

  async function getRecommendationssNextPages() {
    if (recommendationsMovies) {
      const { results, total_pages, total_results } =
        await getRecommendationsMovie(mediaId, currentPage);
      setMoviesList(results);
      setTotalPages(total_pages);
      setTotalResults(total_results);
    }
    if (recommendationsTvShows) {
      const { results, total_pages, total_results } =
        await getRecommendationsTvShow(mediaId, currentPage);
      setTvShowsList(results);
      setTotalPages(total_pages);
      setTotalResults(total_results);
    }
  }

  useEffect(() => {
    if (currentPage > 1) {
      getRecommendationssNextPages();
    }
  }, [currentPage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <section className="p-4 md:px-[2.5%] lg:px-[5%] 2xl:px-[10%]">
      <h1 className="mx-auto mb-4 py-4 text-xl font-bold md:w-[90%] lg:px-4">
        {recommendationsMovies
          ? "Liste des films recommandés"
          : "Liste des séries TV recommandés"}{" "}
        <span className="font-normal">
          ({totalResults} résultat{totalResults > 1 ? "s" : ""})
        </span>
      </h1>
      {totalResults === 0 ? (
        <div>
          <p className="mx-auto mb-4 py-4 text-lg md:w-[90%] lg:px-4">
            Nous n&apos;avons pas suffisamment de données pour vous suggérer des
            films. Vous pouvez nous y aider en notant les films que vous avez
            vus.
          </p>
        </div>
      ) : (
        <div>
          <div className="mx-auto md:w-[90%] 2xl:grid 2xl:grid-cols-2 2xl:gap-4">
            {recommendationsMovies &&
              userMovies &&
              userMoviesId &&
              internalMovies &&
              moviesList.map((movie) => (
                <Card
                  key={movie.id}
                  movie={movie}
                  filterType="movie"
                  genres={genres}
                  fetchUserDatas={fetchUserDatas}
                  favoriteMoviesIds={favoriteMoviesIds}
                  watchlistMoviesIds={watchlistMoviesIds}
                  favoriteTvShowsIds={favoriteTvShowsIds}
                  watchlistTvShowsIds={watchlistTvShowsIds}
                  ratedMovies={ratedMovies}
                  ratedTvShows={ratedTvShows}
                  ratedMoviesIds={ratedMoviesIds}
                  ratedTvShowsIds={ratedTvShowsIds}
                  userLists={userLists}
                  userMovies={userMovies}
                  userMoviesId={userMoviesId}
                  internalMovies={internalMovies}
                />
              ))}
            {recommendationsTvShows &&
              tvShowsList.map((tvShow) => (
                <Card
                  key={tvShow.id}
                  tvShow={tvShow}
                  filterType="tvshow"
                  genres={genres}
                  fetchUserDatas={fetchUserDatas}
                  favoriteMoviesIds={favoriteMoviesIds}
                  watchlistMoviesIds={watchlistMoviesIds}
                  favoriteTvShowsIds={favoriteTvShowsIds}
                  watchlistTvShowsIds={watchlistTvShowsIds}
                  ratedMovies={ratedMovies}
                  ratedTvShows={ratedTvShows}
                  ratedMoviesIds={ratedMoviesIds}
                  ratedTvShowsIds={ratedTvShowsIds}
                  userLists={userLists}
                />
              ))}
          </div>
          <Pagination
            currentPage={currentPage}
            fromMediaDetails={true}
            scrollToTop={scrollToTop}
            setCurrentPage={setCurrentPage}
            total={totalPages || 0}
          />
        </div>
      )}
    </section>
  );
};

export default RecommendationsWrapper;
