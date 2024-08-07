/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Checkbox, Select, SelectItem } from "@nextui-org/react";
import toast from "react-hot-toast";

import ModalComponent from "@/components/Modals/ModalComponent";
import { Episode, InternalTv, SeasonDetails } from "@/models/tvs";
import { getSeasonDetails } from "@/libs/api/tvs";
import Loading from "../Loading/Loading";
import axios from "axios";
import { InternalSeason, InternalSeasonAndUser } from "@/models/seasons";

type Props = {
  modalIsOpen: boolean;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
  tvFromDb: InternalTv;
  tvId: string;
  tvTmdbId: number;
};

const AddEpisodeStatusModal: FC<Props> = (
  {
    modalIsOpen,
    setModalIsOpen,
    tvFromDb,
    tvId,
    tvTmdbId
  }) => {
  const [selectedSeason, setSelectedSeason] = useState<string>("Saison 1");
  const [selectedEpisode, setSelectedEpisode] = useState<string>(
    "Saison 1 - Episode 1"
  );
  const [markAllEpisodes, setMarkAllEpisodes] = useState<boolean>(false);
  const [listOfEpisodes, setListOfEpisodes] = useState<Episode[]>([]);
  const [seasonsDetails, setSeasonsDetails] = useState<SeasonDetails[]>([]);
  const [userSeasons, setUserSeasons] = useState<InternalSeasonAndUser[]>([]);
  const [dbSeasons, setDbSeasons] = useState<InternalSeason[]>([]);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);

  const fetchSeasonsDetailsFromTmdb = async () => {
    let seasons: SeasonDetails[] = [];
    for (let i = 1; i <= tvFromDb.number_of_seasons; i++) {
      const response = await getSeasonDetails(tvTmdbId, i);
      seasons.push(response);
    }
    setSeasonsDetails(seasons);
    const episodes = seasons.find(
      (season) => season.season_number === 1
    )?.episodes;
    setListOfEpisodes(episodes || []);
    setAllEpisodes(seasons.flatMap((season) => season.episodes));
  };

  useEffect(() => {
    fetchSeasonsDetailsFromTmdb();
  }, [tvId]);

  const handleSeasonSelectionChange = (e: any) => {
    setSelectedSeason(e.target.value);
    const episodesList = seasonsDetails.find(
      (season) => `Saison ${season.season_number}` === e.target.value
    )?.episodes;
    setListOfEpisodes(episodesList || []);
    if (episodesList) {
      setSelectedEpisode(
        `${e.target.value} - Episode ${episodesList[0].episode_number}`
      );
    } else {
      setSelectedEpisode("Saison 1 - Episode 1");
    }
  };

  const handleEpisodeSelectionChange = (e: any) => {
    setSelectedEpisode(e.target.value);
  };

  const userEpisodes = userSeasons.flatMap(
    (userSeason) => userSeason.watched_episodes
  );

  const dbEpisodes = dbSeasons.flatMap((dbSeason) => dbSeason.episodes);

  const episodesToAdd = allEpisodes.filter(
    (episode) =>
      !dbEpisodes.find(
        (dbEpisode) =>
          episode.episode_number === dbEpisode.episode_number &&
          episode.season_number === dbEpisode.season_number
      )
  );

  const onValidate = async () => {
    let responseAddEpisodes = { status: 200 };
    if (episodesToAdd.length > 0) {
      responseAddEpisodes = await axios.post("/api/tvs/seasons", {
        tvTmdbId,
        tvId
      });
    }
    if (responseAddEpisodes.status === 200) {
      let statusEpisodes;
      if (markAllEpisodes) {
        statusEpisodes = allEpisodes.map((episode) => ({
          episode: episode,
          watched: true
        }));
      } else {
        const lastEpisode = selectedEpisode.split(" ");
        const lastEpisodeNumber = lastEpisode[lastEpisode.length - 1];
        const lastSeason = selectedSeason.split(" ");
        const lastSeasonNumber = lastSeason[lastSeason.length - 1];
        statusEpisodes = allEpisodes.map((episode) => {
          if (episode.season_number < Number(lastSeasonNumber)) {
            return {
              episode: episode,
              watched: true
            };
          } else if (
            episode.season_number === Number(lastSeasonNumber) &&
            episode.episode_number <= Number(lastEpisodeNumber)
          ) {
            return {
              episode: episode,
              watched: true
            };
          } else {
            return {
              episode: episode,
              watched: false
            };
          }
        });
      }
      const userEpisodesToAdd = statusEpisodes.filter(
        (episode) =>
          !userEpisodes.find(
            (userEpisode) => episode.episode.id === Number(userEpisode._key)
          )
      );
      const userEpisodesToUpdate = statusEpisodes.filter((episode) =>
        userEpisodes.find(
          (userEpisode) =>
            episode.episode.id === Number(userEpisode._key) &&
            episode.watched !== userEpisode.watched
        )
      );
      const responseAddEpisodesStatus = await axios.post(
        "/api/user-tvs/seasons/episodes",
        {
          tvTmdbId,
          tvId,
          userEpisodesToAdd,
          userEpisodesToUpdate
        }
      );
      if (responseAddEpisodesStatus.status === 200) {
        toast.success("Episodes marqués avec succès");
      } else {
        toast.error("Erreur lors du marquage des épisodes");
      }
    } else {
      toast.error("Erreur lors de l'ajout des épisodes");
    }
    setModalIsOpen(false);
    setSeasonsDetails([]);
    setListOfEpisodes([]);
    setSelectedSeason("Saison 1");
    setSelectedEpisode("Saison 1 - Episode 1");
    setMarkAllEpisodes(false);
  };

  const onClose = () => {
    setModalIsOpen(false);
    setSeasonsDetails([]);
    setListOfEpisodes([]);
    setSelectedSeason("Saison 1");
    setSelectedEpisode("Saison 1 - Episode 1");
    setMarkAllEpisodes(false);
  };

  return (
    <ModalComponent
      modalIsOpen={modalIsOpen}
      className="min-h-[400px]"
      title="Marquer les épisodes"
      onValidate={onValidate}
      onClose={onClose}
    >
      {seasonsDetails &&
      seasonsDetails.length > 0 &&
      listOfEpisodes &&
      listOfEpisodes.length > 0 ? (
        <div className="flex flex-col items-start justify-center">
          <p className="mb-4">Marquer les épisodes jusqu&apos;à :</p>
          <Select
            placeholder="Liste des saisons"
            defaultSelectedKeys={["Saison 1"]}
            selectedKeys={[selectedSeason]}
            onChange={handleSeasonSelectionChange}
            label="Saisons"
            className="mb-4"
          >
            {seasonsDetails.map((season) => (
              <SelectItem
                key={`Saison ${season.season_number}`}
                value={`Saison ${season.season_number}`}
              >
                {season.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            placeholder="Liste des épisodes"
            defaultSelectedKeys={["Saison 1 - Episode 1"]}
            selectedKeys={[selectedEpisode]}
            onChange={handleEpisodeSelectionChange}
            label="Episodes"
            className="mb-12"
          >
            {listOfEpisodes.map((episode) => (
              <SelectItem
                key={`Saison ${episode.season_number} - Episode ${episode.episode_number}`}
                value={`Saison ${episode.season_number} - Episode ${episode.episode_number}`}
              >
                {`Episode ${episode.episode_number} - ${episode.name}`}
              </SelectItem>
            ))}
          </Select>
          <Checkbox
            isSelected={markAllEpisodes}
            onValueChange={setMarkAllEpisodes}
          >
            Marquer tous les épisodes
          </Checkbox>
        </div>
      ) : (
        <Loading />
      )}
    </ModalComponent>
  );
};

export default AddEpisodeStatusModal;
