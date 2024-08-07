import { getGenresMovies, getSearchMovies } from "@/libs/api/movies";
import { getGenresTvs, getSearchTvs } from "@/libs/api/tvs";
import Pagination from "@/components/Pagination/Pagination";
import { getSearchPeople } from "@/libs/api/people";
import Loading from "@/components/Loading/Loading";
import SearchResultCards from "./SearchResultCards";

type Props = {
  query: string;
  currentPage: number;
  filterType: string;
};

const SearchResult = async (props: Props) => {
  const { query, currentPage, filterType } = props;
  const {
    results: searchResultsMovies,
    total_pages: totalSearchPagesMovies,
    total_results: totalSearchResultsMovies
  } = await getSearchMovies(query, currentPage);
  const {
    results: searchResultsTvs,
    total_pages: totalSearchPagesTvs,
    total_results: totalSearchResultsTvs
  } = await getSearchTvs(query, currentPage);
  const {
    results: searchResultsPeople,
    total_pages: totalSearchPagesPeople,
    total_results: totalSearchResultsPeople
  } = await getSearchPeople(query, currentPage);

  const { genres: genresMovies } = await getGenresMovies();
  const { genres: genresTvs } = await getGenresTvs();

  return (
    <div className="md:col-span-3">
      {(filterType === "movie" && !searchResultsMovies && !genresMovies) ||
      (filterType === "tv" && !searchResultsTvs && !genresTvs) ||
      (filterType === "people" && !searchResultsPeople) ? (
        <Loading />
      ) : (filterType === "movie" && searchResultsMovies.length === 0) ||
      (filterType === "tv" && searchResultsTvs.length === 0) ||
      (filterType === "people" && searchResultsPeople.length === 0) ? (
        <div className="text-center text-lg md:text-xl">Aucun résultat</div>
      ) : (
        <div>
          <h3 className="mb-4 text-center text-lg md:text-xl">
            Résultats de votre recherche{" "}
            <span className="text-xs font-bold md:text-lg">
              (
              {filterType === "movie"
                ? totalSearchResultsMovies
                : filterType === "tv"
                  ? totalSearchResultsTvs
                  : totalSearchResultsPeople}
              )
            </span>
          </h3>
          <SearchResultCards
            filterType={filterType}
            searchResultsMovies={searchResultsMovies}
            searchResultsTvs={searchResultsTvs}
            searchResultsPeople={searchResultsPeople}
            genresMovies={genresMovies}
            genresTvs={genresTvs}
          />

          <Pagination
            total={
              filterType === "movie"
                ? totalSearchPagesMovies
                : filterType === "tv"
                  ? totalSearchPagesTvs
                  : totalSearchPagesPeople
            }
            fromSearch={true}
          />
        </div>
      )}
    </div>
  );
};

export default SearchResult;
