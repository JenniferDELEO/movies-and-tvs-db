"use client";

import dayjs from "dayjs";
import Image from "next/image";
import { FC } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";

import { SeasonDetails } from "@/models/tvShows";

type Props = {
  seasonDetails: SeasonDetails;
};

const EpisodesBanner: FC<Props> = (props) => {
  const { seasonDetails } = props;
  return (
    <>
      <h1 className="mx-auto py-4 text-xl font-bold md:w-[90%]">
        Episodes ({seasonDetails.episodes.length})
      </h1>
      <div className="mx-auto flex size-full flex-row items-baseline justify-start overflow-x-auto md:w-[93%]">
        {seasonDetails.episodes.length > 0 &&
          seasonDetails.episodes.map((episode) => (
            <div key={episode.id} className="mx-2 my-4">
              <Card
                /* isPressable */
                className="mx-2 my-4 flex cursor-pointer flex-col items-center justify-center bg-transparent"
                /* onPress={() => setSelectedSeason(season)} */
              >
                <CardBody
                  className="flex flex-col items-center justify-center"
                  style={{
                    width: 300,
                    height: 238,
                  }}
                >
                  <Image
                    alt={`poster de l'épisode ${episode.episode_number} de la saison ${seasonDetails.season_number}`}
                    src={
                      episode?.still_path
                        ? `${process.env.NEXT_PUBLIC_TMDB_API_IMAGE_URL}/w342${episode.still_path}`
                        : "/images/defaultImage.png"
                    }
                    width={0}
                    height={0}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 5,
                    }}
                    sizes="100vw"
                  />
                </CardBody>
                <CardFooter className="h-[120px] flex-col items-center justify-start px-4 pb-4">
                  <h4 className="text-center text-sm">
                    S{episode.season_number < 10 ? "0" : ""}
                    {episode.season_number}E
                    {episode.episode_number < 10 ? "0" : ""}
                    {episode.episode_number} - {episode.name}
                  </h4>
                  <p className="py-2 text-gray-400">
                    {episode?.air_date
                      ? dayjs(episode.air_date).format("DD/MM/YYYY")
                      : "Aucune date renseignée"}
                  </p>
                </CardFooter>
              </Card>
            </div>
          ))}
      </div>
    </>
  );
};

export default EpisodesBanner;