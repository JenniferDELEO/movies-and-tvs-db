/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ChangeEvent, FC, useEffect, useState, useRef } from "react";
import { Button } from "@nextui-org/react";
import { usePathname } from "next/navigation";

import Filters from "@/components/Filters/Filters";
import Cards from "@/components/Cards/Cards";
import {
  Genre,
  InternalMovie,
  InternalMovieUser,
  Movie,
} from "@/models/movies";
import OrderingSelect from "@/components/Filters/OrderingSelect";
import { Watcher } from "@/models/watchers";
import FiltersModal from "@/components/Modals/FiltersModal";
import { getDiscoverMovies } from "@/libs/api/movies";
import Pagination from "@/components/Pagination/Pagination";
import { defaultMoviesFilters } from "@/libs/helpers/filters";
import { MoviesFilters } from "@/models/filters";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllMovies } from "@/redux/features/movies/movieSlice";

type Props = {
  genresMovies: Genre[];
  movies: Movie[];
  providersMovies: Watcher[];
  title: string;
  totalPagesMovies: number;
  userMovies: InternalMovieUser[];
  userMoviesId: string;
  internalMovies: InternalMovie[];

  defaultFilters?: MoviesFilters;
};

const MoviesWrapper: FC<Props> = (props) => {
  const {
    movies,
    genresMovies,
    providersMovies,
    title,
    totalPagesMovies,
    userMovies,
    userMoviesId,
    internalMovies,

    defaultFilters,
  } = props;
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [moviesList, setMoviesList] = useState<Movie[]>(movies);
  const [filters, setFilters] = useState<MoviesFilters>(
    defaultFilters || defaultMoviesFilters,
  );
  const [openFilters, setOpenFilters] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(totalPagesMovies);
  const [filterType, setFilterType] = useState("popularity.desc");
  const [currentPage, setCurrentPage] = useState(
    pathname.split("/")[2] ? parseInt(pathname.split("/")[2]) : 1,
  );
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const reduxMovies = useAppSelector((state) => state.movies);

  console.log("reduxMovie", reduxMovies);

  const ref = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  async function getMoviesNextPages() {
    const result = await getDiscoverMovies({
      ...filters,
      page: currentPage,
    });
    setMoviesList(result.results);
  }

  useEffect(() => {
    dispatch(fetchAllMovies());
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      getMoviesNextPages();
    }
  }, [currentPage]);

  const handleOrderingSelection = async (e: ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, sort_by: e.target.value });
    setFilterType(e.target.value);
    const result = await getDiscoverMovies({
      ...filters,
      sort_by: e.target.value,
      page: currentPage,
    });
    setMoviesList(result.results);
  };

  const handleFiltersSelection = async () => {
    const result = await getDiscoverMovies({
      ...filters,
    });
    setMoviesList(result.results);
    setTotalPages(result.total_pages);
    scrollToTop();
  };

  const handleResetFilters = async () => {
    setFilters(defaultMoviesFilters);
    const result = await getDiscoverMovies({
      ...defaultMoviesFilters,
    });
    setMoviesList(result.results);
    setTotalPages(result.total_pages);
    setIsResetting(true);
  };

  const hideResetButton = () => {
    if (
      filters["primary_release_date.gte"] !==
        defaultMoviesFilters["primary_release_date.gte"] ||
      filters["primary_release_date.lte"] !==
        defaultMoviesFilters["primary_release_date.lte"] ||
      filters.show_me !== defaultMoviesFilters.show_me ||
      filters["vote_average.gte"] !==
        defaultMoviesFilters["vote_average.gte"] ||
      filters["vote_average.lte"] !==
        defaultMoviesFilters["vote_average.lte"] ||
      filters["vote_count.gte"] !== defaultMoviesFilters["vote_count.gte"] ||
      filters.with_genres !== defaultMoviesFilters.with_genres ||
      filters.with_original_language !==
        defaultMoviesFilters.with_original_language ||
      filters["with_runtime.gte"] !==
        defaultMoviesFilters["with_runtime.gte"] ||
      filters["with_runtime.lte"] !==
        defaultMoviesFilters["with_runtime.lte"] ||
      filters.with_watch_providers !==
        defaultMoviesFilters.with_watch_providers ||
      filters.without_genres !== defaultMoviesFilters.without_genres
    ) {
      return false;
    } else return true;
  };

  return (
    <div className="mx-auto w-full md:w-[95%] lg:w-[90%]">
      <div className="mx-4 mb-4 flex flex-row items-baseline justify-between">
        <h3 className="text-lg lg:text-xl">{title}</h3>
        <div className="hidden lg:block">
          {!hideResetButton() && (
            <Button onClick={handleResetFilters}>Effacer les Filtres</Button>
          )}
        </div>
        <OrderingSelect
          filterType={filterType}
          handleSelectionChange={handleOrderingSelection}
        />
      </div>
      <div className="mx-4 mb-4 flex flex-row items-center justify-between lg:hidden">
        <Button onClick={() => setOpenFilters((prev) => !prev)}>
          Ajouter des Filtres
        </Button>
        {!hideResetButton() && (
          <Button onClick={handleResetFilters}>Effacer les Filtres</Button>
        )}
      </div>
      <div className="hidden lg:flex lg:flex-row">
        <Filters
          moviesFilters={filters}
          setMoviesFilters={setFilters}
          genres={genresMovies}
          providers={providersMovies}
          setIsFiltering={setIsFiltering}
          isResetting={isResetting}
          setIsResetting={setIsResetting}
        />
        <div className="w-full lg:w-3/4" ref={ref}>
          {moviesList.length > 0 ? (
            <>
              <Cards
                movies={moviesList}
                filterType="movie"
                genres={genresMovies}
                internalMovies={internalMovies}
                userMovies={userMovies}
                userMoviesId={userMoviesId}
              />
              <Pagination
                total={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                scrollToTop={scrollToTop}
              />
            </>
          ) : (
            <div className="mt-20 flex w-full flex-col items-center justify-center">
              <h3 className="mb-4 text-lg lg:text-xl">
                Aucun film ne correspond à vos critères
              </h3>
              <Button onClick={handleResetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="lg:hidden">
        <FiltersModal
          modalIsOpen={openFilters}
          setModalIsOpen={setOpenFilters}
          moviesFilters={filters}
          setMoviesFilters={setFilters}
          genres={genresMovies}
          providers={providersMovies}
          setIsFiltering={setIsFiltering}
          handleFiltersSelection={handleFiltersSelection}
          isResetting={isResetting}
          setIsResetting={setIsResetting}
        />
        <div className="w-full">
          <Cards
            movies={moviesList}
            filterType="movie"
            genres={genresMovies}
            internalMovies={internalMovies}
            userMovies={userMovies}
            userMoviesId={userMoviesId}
          />
          <Pagination
            total={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            scrollToTop={scrollToTop}
          />
        </div>
      </div>
      {isFiltering && (
        <Button
          onClick={handleFiltersSelection}
          className="bottom-0 left-0 hidden w-full rounded-lg bg-secondary text-white lg:sticky lg:block"
        >
          Rechercher
        </Button>
      )}
    </div>
  );
};

export default MoviesWrapper;
