import sanityClient from "../sanity";
import axios from "axios";
import * as queries from "../queries/tvSeasonQueries";
import {
  AddSeason,
  CreateSeasonStatus,
  InternalSeason,
  InternalSeasonAndUser,
  UpdateSeason,
  UpdateSeasonStatus,
} from "@/models/seasons";

/*-------------------- GET --------------------*/

export async function getAllSeasonsByTvId(tvId: string) {
  const result = await sanityClient.fetch<InternalSeason[]>(
    queries.getAllSeasonsByTvIdQuery,
    { tvId },
    { cache: "no-cache" },
  );
  return result;
}

export async function getUserSeasonsByTv(tvId: string, userId: string) {
  const result = await sanityClient.fetch<InternalSeasonAndUser[]>(
    queries.getUserSeasonsByTvQuery,
    { tvId, userId },
    { cache: "no-cache" },
  );
  return result;
}

/*-------------------- POST / PATCH --------------------*/

export async function addSeason({
  tvName,
  seasonNumber,
  tvId,
  numberOfEpisodes,
  releaseDate,
  tmdbId,
}: AddSeason) {
  const mutation = {
    mutations: [
      {
        create: {
          _type: "season",
          tv_name: tvName,
          season_number: seasonNumber,
          tv: {
            _type: "reference",
            _ref: tvId,
          },
          number_of_episodes: numberOfEpisodes,
          release_date: releaseDate,
          tmdb_id: tmdbId,
        },
      },
    ],
  };

  const { data } = await axios.post(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
    mutation,
    { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } },
  );
  return data;
}

export async function updateSeason({
  seasonId,
  numberOfEpisodes,
}: UpdateSeason) {
  const mutation = {
    mutations: [
      {
        patch: {
          id: seasonId,
          number_of_episodes: numberOfEpisodes,
        },
      },
    ],
  };

  const { data } = await axios.post(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
    mutation,
    { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } },
  );
  return data;
}

export async function createUserSeasonAndStatus({
  userName,
  userId,
  tvId,
  seasonId,
  allWatched,
}: CreateSeasonStatus) {
  const mutation = {
    mutations: [
      {
        create: {
          _type: "user_season",
          user_name: userName,
          user: {
            _type: "reference",
            _ref: userId,
          },
          tv: {
            _type: "reference",
            _ref: tvId,
          },
          season: {
            _type: "reference",
            _ref: seasonId,
          },
          account_states: {
            all_watched: allWatched,
          },
        },
      },
    ],
  };

  const { data } = await axios.post(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
    mutation,
    { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } },
  );
  return data;
}

export async function updateUserSeasonAndStatus({
  userSeasonId,
  allWatched,
}: UpdateSeasonStatus) {
  const mutation = {
    mutations: [
      {
        patch: {
          id: userSeasonId,
          account_states: {
            all_watched: allWatched,
          },
        },
      },
    ],
  };

  const { data } = await axios.post(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
    mutation,
    { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } },
  );
  return data;
}

/*-------------------- DELETE --------------------*/

export async function deleteUserSeasonAndStatus(userSeasonId: string) {
  const mutation = {
    mutations: [
      {
        delete: {
          id: userSeasonId,
        },
      },
    ],
  };

  const { data } = await axios.post(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
    mutation,
    { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } },
  );

  return data;
}
