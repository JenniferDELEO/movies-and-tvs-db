"use client";

import { FC, useState } from "react";
import dayjs from "dayjs";
import { Button } from "@nextui-org/react";
import { FaPlay } from "react-icons/fa";

import { Genre, MovieDetails } from "@/models/movies";
import StarRating from "@/components/StarRate/StarRating";
import YoutubeEmbed from "@/components/YoutubeEmbed/YoutubeEmbed";
import { languages } from "@/libs/helpers/languages";
import { Episode, EpisodeDetails, TvDetails } from "@/models/tvs";
import { Collection } from "@/models/collections";

type Props = {
  movieDetails?: MovieDetails;
  tvDetails?: TvDetails;
  episodeDetails?: EpisodeDetails;
  collectionDetails?: Collection;
  genresCollection?: Genre[];
  voteAverageCollection?: number;
  type: "episode" | "movie" | "tv";
  episodePrecedent?: Episode | undefined;
  episodeNumber?: number;
  isCollection?: boolean;
  seasonNumber?: number;
  tvId?: number;
};

const Infos: FC<Props> = (props) => {
  const {
    movieDetails,
    tvDetails,
    episodeDetails,
    collectionDetails,
    genresCollection,
    voteAverageCollection,
    type,
    episodeNumber,
    episodePrecedent,
    isCollection,
    seasonNumber,
    tvId
  } = props;
  const [openTrailer, setOpenTrailer] = useState(false);

  const trailer =
    movieDetails?.videos?.results?.find((video) => video.type === "Trailer") ||
    (type === "tv" &&
      tvDetails?.videos?.results?.find((video) => video.type === "Trailer"));

  const runtimeHours = movieDetails?.runtime
    ? Math.floor(movieDetails.runtime / 60)
    : 0;
  const runtimeMinutes = movieDetails?.runtime ? movieDetails.runtime % 60 : 0;

  const directors =
    movieDetails?.credits?.crew?.filter((crew) => crew.job === "Director") ||
    (type === "tv" && tvDetails?.aggregate_credits?.crew)
      ? tvDetails?.aggregate_credits?.crew
        ?.filter((crew) => crew.department === "Directing")
        .slice(0, 3)
      : episodeDetails?.crew
        ? episodeDetails.crew?.filter((crew) => crew.department === "Directing")
        : [];
  const writers = movieDetails?.credits?.crew
    ?.filter((crew) => crew.job === "Writer")
    .filter((crew) => crew.name !== directors?.[0]?.name);

  const originalLanguageName =
    languages.find(
      (language) => language.code === movieDetails?.original_language
    )?.name ||
    languages.find((language) => language.code === tvDetails?.original_language)
      ?.name;

  const watchProvidersFr =
    movieDetails?.watch_providers_fr ||
    (type === "tv" && tvDetails?.watch_providers_fr);

  const releaseDate =
    movieDetails?.release_date ||
    episodeDetails?.air_date ||
    tvDetails?.first_air_date;

  const genres = movieDetails?.genres || tvDetails?.genres || genresCollection;

  const overview =
    (type === "movie" && movieDetails?.overview) ||
    (type === "episode" && episodeDetails?.overview) ||
    (type === "tv" && tvDetails?.overview) ||
    (isCollection && collectionDetails?.overview);
  ("");

  return (
    <div className="md:flex md:size-full md:flex-col md:justify-center">
      {/* Screen size < md */}
      <div className="fixed bottom-0 left-0 z-20 w-full bg-primary md:hidden">
        {watchProvidersFr && watchProvidersFr.length > 0 && (
          <div className="w-full bg-primary/90">
            <div className="flex flex-row flex-wrap items-center justify-center">
              {watchProvidersFr.map((watchProvider) => (
                <div
                  key={watchProvider.provider_id}
                  className="my-2 mr-2 size-10"
                >
                  <picture>
                    <img
                      alt={`logo-${watchProvider.provider_name}`}
                      src={
                        watchProvider.logo_path
                          ? `${process.env.NEXT_PUBLIC_TMDB_API_IMAGE_URL}/w500${watchProvider.logo_path}`
                          : "/images/defaultImage.png"
                      }
                      width={0}
                      height={0}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        minWidth: "100%",
                        minHeight: "100%",
                        borderWidth: 0,
                        outline: 0,
                        borderRadius: 5
                      }}
                      sizes="100vw"
                    />
                  </picture>
                </div>
              ))}
            </div>
          </div>
        )}
        {/*{type !== "episode" && !isCollection && session && (
          <div className="flex flex-row items-center justify-evenly">
            <AccountInteraction
              item={{
                id: movieDetails?.id || tvDetails?.id || 0,
                name: tvDetails?.name,
                title: movieDetails?.title,
                genres: genres,
                poster_path:
                  movieDetails?.poster_path || tvDetails?.poster_path || "",
                overview: overview || "",
                release_date: releaseDate || "",
              }}
              type={type}
            />
          </div>
        )}*/}
      </div>

      {openTrailer && trailer && (
        <YoutubeEmbed embedId={trailer.key} setOpenTrailer={setOpenTrailer} />
      )}

      {/* All screen sizes */}
      <div className="text-center md:my-4 md:ml-10 md:text-start">
        <h1 className="text-xl font-bold md:text-3xl">
          {movieDetails?.title ||
            episodeDetails?.name ||
            (type === "tv" && tvDetails?.name) ||
            collectionDetails?.name}
          <span className="text-base font-normal text-gray-400 md:text-2xl">
            {" "}
            {!isCollection && type !== "episode"
              ? releaseDate
                ? `(${dayjs(releaseDate).format("YYYY")})`
                : "(Non sortie)"
              : null}
          </span>
        </h1>

        {/* Screen size > md */}
        <div className="mt-2 hidden text-sm md:block">
          {type === "movie" && !isCollection ? (
            <div className="text-gray-400">
              <div className="flex flex-row items-center justify-start">
                <p className="pr-3 text-gray-400">
                  <span className="font-bold text-white">
                    Date de sortie :{" "}
                  </span>
                  {movieDetails?.release_date
                    ? dayjs(movieDetails?.release_date).format("DD MMMM YYYY")
                    : "Non sortie"}{" "}
                  (FR)
                </p>
                <p className="pr-3 text-gray-400">
                  <span className="font-bold text-white">Durée : </span>
                  {runtimeHours} h {runtimeMinutes} min
                </p>
              </div>
            </div>
          ) : null}
          {(type === "tv" || type === "episode") && (
            <div className="flex flex-row items-center justify-start">
              <p className="pr-3 text-gray-400">
                <span className="font-bold text-white">Date de sortie : </span>
                {releaseDate
                  ? dayjs(releaseDate).format("DD MMMM YYYY")
                  : "Non sortie"}{" "}
                (FR)
              </p>
              {type === "tv" &&
                tvDetails?.episode_run_time &&
                tvDetails.episode_run_time.length > 0 && (
                  <div className="flex flex-row items-center justify-start">
                    <p className="pr-3 font-bold text-white">
                      Durée d&apos;un épisode :{" "}
                      {tvDetails.episode_run_time.map((runtime, index) => {
                        if (index === tvDetails.episode_run_time.length - 1) {
                          return (
                            <span
                              key={index}
                              className="pt-2 font-normal text-gray-400"
                            >
                              {runtime} min
                            </span>
                          );
                        }
                        return (
                          <span
                            key={index}
                            className="pt-2 font-normal text-gray-400"
                          >
                            {runtime},{" "}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                )}
              {type === "episode" && (
                <p className="pr-3 text-gray-400">
                  <span className="font-bold text-white">Durée : </span>
                  {episodeDetails?.runtime} min
                </p>
              )}
              {tvDetails?.status && (
                <p className="text-gray-400">
                  <span className="font-bold text-white">Statut : </span>
                  {tvDetails.status === "Ended" ? (
                    <span className="text-gray-400">Terminée</span>
                  ) : tvDetails.status === "Canceled" ? (
                    <span className="text-gray-400">Annulée</span>
                  ) : (
                    <span className="text-gray-400">En cours</span>
                  )}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-row flex-wrap items-center justify-start">
            {genres && (
              <p className="pr-3 pt-2">
                <span className="font-bold">Genres : </span>

                {genres.map((genre, index) => {
                  if (index === genres.length - 1) {
                    return (
                      <span key={genre.id} className="text-gray-400">
                        {genre?.name}
                      </span>
                    );
                  }
                  return (
                    <span key={genre.id} className="text-gray-400">
                      {genre?.name},{" "}
                    </span>
                  );
                })}
              </p>
            )}
            {originalLanguageName && (
              <p className="pr-3 pt-2 text-gray-400">
                <span className="font-bold text-white">Langue : </span>
                {originalLanguageName}
              </p>
            )}
            {type === "tv" && tvDetails?.number_of_seasons && (
              <div className="flex flex-row items-center justify-start">
                <p className="pr-3 pt-2 text-gray-400">
                  <span className="font-bold text-white">Saisons : </span>
                  {tvDetails.number_of_seasons}
                </p>
              </div>
            )}
            {seasonNumber && (
              <div className="flex flex-row items-center justify-start">
                <p className="pr-3 pt-2 text-gray-400">
                  <span className="font-bold text-white">Saison : </span>
                  {seasonNumber}
                </p>
              </div>
            )}
            {type === "tv" && tvDetails?.number_of_episodes && (
              <div className="flex flex-row items-center justify-start">
                <p className="pr-3 pt-2 text-gray-400">
                  <span className="font-bold text-white">Episodes : </span>
                  {tvDetails.number_of_episodes}
                </p>
              </div>
            )}
            {episodeNumber && (
              <div className="flex flex-row items-center justify-start">
                <p className="pr-3 pt-2 text-gray-400">
                  <span className="font-bold text-white">Episode : </span>
                  {episodeNumber}
                </p>
              </div>
            )}
            {episodePrecedent && seasonNumber && episodeNumber && (
              <div className="flex flex-row items-center justify-start">
                <p className="pr-3 pt-2 text-gray-400">
                  <span className="font-bold text-white">
                    Episode précédent :{" "}
                  </span>
                  S
                  {episodePrecedent.season_number > 9
                    ? episodePrecedent.season_number
                    : `0${episodePrecedent.season_number}`}
                  E
                  {episodePrecedent.episode_number > 9
                    ? episodePrecedent.episode_number
                    : `0${episodePrecedent.episode_number}`}{" "}
                  - {episodePrecedent.name}
                </p>
              </div>
            )}
            {type === "tv" && tvDetails?.next_episode_to_air && (
              <div className="flex flex-row items-center justify-start">
                <p className="pr-3 pt-2 text-gray-400">
                  <span className="font-bold text-white">
                    Prochaine sortie :{" "}
                  </span>
                  S
                  {tvDetails.next_episode_to_air.season_number > 9
                    ? tvDetails.next_episode_to_air.season_number
                    : `0${tvDetails.next_episode_to_air.season_number}`}
                  E
                  {tvDetails.next_episode_to_air.episode_number > 9
                    ? tvDetails.next_episode_to_air.episode_number
                    : `0${tvDetails.next_episode_to_air.episode_number}`}{" "}
                  - {tvDetails.next_episode_to_air.name} - Le{" "}
                  {dayjs(tvDetails.next_episode_to_air.air_date).format(
                    "DD MMMM YYYY"
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All screen sizes */}
      <div className="m-4 ml-10 flex flex-row items-center justify-evenly md:justify-start">
        <div className="flex flex-row items-center justify-evenly">
          <div className="flex flex-col items-center justify-center md:mr-10 md:items-start">
            <p className="font-bold">Note moyenne</p>
            <StarRating
              count={5}
              value={
                movieDetails?.vote_average
                  ? movieDetails.vote_average / 2
                  : episodeDetails?.vote_average
                    ? episodeDetails.vote_average / 2
                    : tvDetails?.vote_average
                      ? tvDetails.vote_average / 2
                      : voteAverageCollection
                        ? voteAverageCollection / 2
                        : 0
              }
              size={20}
              edit={false}
            />
            {!isCollection && (
              <p className="mt-1 text-xs text-gray-400">
                (
                {movieDetails?.vote_count ||
                  episodeDetails?.vote_count ||
                  tvDetails?.vote_count}{" "}
                vote
                {movieDetails?.vote_count && movieDetails.vote_count > 1
                  ? "s"
                  : ""}
                {type === "tv" &&
                tvDetails?.vote_count &&
                tvDetails.vote_count > 1
                  ? "s"
                  : ""}
                {episodeDetails?.vote_count && episodeDetails.vote_count > 1
                  ? "s"
                  : ""}
                )
              </p>
            )}
          </div>
          {/*{type === "episode" &&
            episodeDetails &&
            episodeNumber &&
            seasonNumber &&
            tvId && session && (
              <div className="ml-6">
                <AccountInteraction item={episodeDetails} type={type} />
              </div>
            )}*/}
        </div>
        <div className="flex flex-row items-center justify-evenly md:mx-10">
          <>
            {/*{type !== "episode" && !isCollection && session && (
              <div className="hidden md:mr-10 md:block">
                <AccountInteraction
                  item={{
                    id: movieDetails?.id || tvDetails?.id || 0,
                    name: tvDetails?.name,
                    title: movieDetails?.title,
                    genres: genres,
                    poster_path:
                      movieDetails?.poster_path || tvDetails?.poster_path || "",
                    overview: overview || "",
                    release_date: releaseDate || "",
                  }}
                  type={type}
                />
              </div>
            )}*/}
            {trailer && (
              <Button variant="light" onClick={() => setOpenTrailer(true)}>
                <FaPlay size={12} className="text-white" />
                Bande annonce
              </Button>
            )}
          </>
        </div>
      </div>

      {/* Screen size < md */}
      <div className="my-4 flex flex-col items-center justify-center px-[10%] text-sm text-gray-400 md:hidden">
        {type === "movie" && !isCollection && (
          <>
            <p>
              <span className="font-bold text-white">Date de sortie : </span>
              {releaseDate
                ? dayjs(releaseDate).format("DD MMMM YYYY")
                : "Non sortie"}{" "}
              (FR)
            </p>
            <div className="flex flex-row items-center justify-center pt-2">
              <p className="pt-2">
                <span className="font-bold text-white">Durée : </span>
                {runtimeHours} h {runtimeMinutes} min
              </p>
              {originalLanguageName && (
                <p className="pt-2">
                  <span className="font-bold text-white">Langue : </span>
                  {originalLanguageName}
                </p>
              )}
            </div>
          </>
        )}
        {(type === "tv" || type === "episode") && (
          <div className="flex flex-col items-center justify-start md:flex-row">
            <p className="text-gray-400">
              <span className="font-bold text-white">Date de sortie : </span>
              {releaseDate
                ? dayjs(releaseDate).format("DD MMMM YYYY")
                : "Non sortie"}{" "}
              (FR)
            </p>
            <div className="flex flex-row flex-wrap items-center justify-center pt-2">
              <>
                {type === "tv" &&
                  tvDetails?.episode_run_time &&
                  tvDetails.episode_run_time?.length > 0 && (
                    <div className="flex flex-row items-center justify-start">
                      <p className="pr-3 font-bold text-white">
                        Durée d&apos;un épisode :{" "}
                        {tvDetails.episode_run_time.map((runtime, index) => {
                          if (index === tvDetails.episode_run_time.length - 1) {
                            return (
                              <span
                                key={index}
                                className="pt-2 font-normal text-gray-400"
                              >
                                {runtime} min
                              </span>
                            );
                          }
                          return (
                            <span
                              key={index}
                              className="pt-2 font-normal text-gray-400"
                            >
                              {runtime},{" "}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  )}
                {type === "episode" && (
                  <p className="pr-3 pt-2 text-gray-400">
                    <span className="font-bold text-white">Durée : </span>
                    {episodeDetails?.runtime} min
                  </p>
                )}
                {tvDetails?.status && (
                  <p className="pr-3 pt-2 text-gray-400">
                    <span className="font-bold text-white">Statut : </span>
                    {tvDetails.status === "Ended" ? (
                      <span className="text-gray-400">Terminée</span>
                    ) : tvDetails.status === "Canceled" ? (
                      <span className="text-gray-400">Annulée</span>
                    ) : (
                      <span className="text-gray-400">En cours</span>
                    )}
                  </p>
                )}
              </>
              {originalLanguageName && (
                <p className="pt-2">
                  <span className="font-bold text-white">Langue : </span>
                  {originalLanguageName}
                </p>
              )}
            </div>
          </div>
        )}
        {genres && (
          <p className="pt-2 text-center">
            <span className="font-bold text-white">Genres : </span>
            {genres.map((genre, index) => {
              if (index === genres.length - 1) {
                return <span key={genre.id}>{genre?.name}</span>;
              }
              return <span key={genre.id}>{genre?.name}, </span>;
            })}
          </p>
        )}
        {type === "tv" &&
          tvDetails?.number_of_episodes &&
          tvDetails?.number_of_seasons && (
            <div className="flex flex-row flex-wrap items-center justify-center">
              <div className="flex flex-row items-center justify-start">
                <p className="pr-3 pt-2 text-gray-400">
                  <span className="font-bold text-white">Saisons : </span>
                  {tvDetails.number_of_seasons}
                </p>
              </div>
              <div className="flex flex-row items-center justify-start">
                <p className="pr-3 pt-2 text-gray-400">
                  <span className="font-bold text-white">Episodes : </span>
                  {tvDetails.number_of_episodes}
                </p>
              </div>
            </div>
          )}
        {episodeNumber && seasonNumber && (
          <div className="flex flex-row flex-wrap items-center justify-center">
            <div className="flex flex-row items-center justify-start">
              <p className="pr-3 pt-2 text-gray-400">
                <span className="font-bold text-white">Saison : </span>
                {seasonNumber}
              </p>
            </div>
            <div className="flex flex-row items-center justify-start">
              <p className="pr-3 pt-2 text-gray-400">
                <span className="font-bold text-white">Episode : </span>
                {episodeNumber}
              </p>
            </div>
          </div>
        )}
        {episodePrecedent && seasonNumber && episodeNumber && (
          <div className="flex flex-row items-center justify-start">
            <p className="pr-3 pt-2 text-gray-400">
              <span className="font-bold text-white">Episode précédent : </span>
              S
              {episodePrecedent.season_number > 9
                ? episodePrecedent.season_number
                : `0${episodePrecedent.season_number}`}
              E
              {episodePrecedent.episode_number > 9
                ? episodePrecedent.episode_number
                : `0${episodePrecedent.episode_number}`}{" "}
              - {episodePrecedent.name}
            </p>
          </div>
        )}
        {type === "tv" && tvDetails?.next_episode_to_air && (
          <div className="flex flex-row items-center justify-start">
            <p className="pr-3 pt-8 text-center text-gray-400">
              <span className="font-bold text-white">Prochaine sortie : </span>S
              {tvDetails.next_episode_to_air.season_number > 9
                ? tvDetails.next_episode_to_air.season_number
                : `0${tvDetails.next_episode_to_air.season_number}`}
              E
              {tvDetails.next_episode_to_air.episode_number > 9
                ? tvDetails.next_episode_to_air.episode_number
                : `0${tvDetails.next_episode_to_air.episode_number}`}{" "}
              - {tvDetails.next_episode_to_air.name} - Le{" "}
              {dayjs(tvDetails.next_episode_to_air.air_date).format(
                "DD MMMM YYYY"
              )}
            </p>
          </div>
        )}
      </div>

      {/* All screen sizes */}
      <div className="m-4 ml-10">
        {(movieDetails?.tagline || tvDetails?.tagline) && (
          <p className="italic text-gray-400">
            {movieDetails?.tagline || tvDetails?.tagline}
          </p>
        )}
        <div className="my-4">
          <h2 className="pt-2 text-lg font-bold">Synopsis</h2>
          {overview && overview.length > 0 ? (
            <p className="my-4 mr-4 text-sm md:text-justify">{overview}</p>
          ) : (
            <p className="my-4 mr-4 text-sm md:text-justify">Non renseigné</p>
          )}
        </div>
      </div>

      {/* All screen sizes */}
      <div className="m-4 ml-10 mr-6 flex flex-row flex-wrap items-center justify-between">
        {directors?.map((director) => (
          <div key={director.id} className="m-2">
            <h2 className="font-bold">Direction</h2>
            <p className="text-sm">{director.name}</p>
          </div>
        ))}
        {writers?.map((writer) => (
          <div key={writer.id} className="m-2">
            <h2 className="font-bold">Réalisation</h2>
            <p className="text-sm">{writer.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Infos;
