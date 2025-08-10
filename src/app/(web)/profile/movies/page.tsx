"use client";

import { useSession } from "next-auth/react";

import WorkInProgress from "@/components/WorkInProgress/WorkInProgress";
import { getAllMovies, getUserMovies } from "@/libs/sanity/api/movie";
import { Suspense, useEffect, useState } from "react";
import { InternalMovie, InternalMovieUser } from "@/models/movies";
import LoadingSpinner from "../../loading";
import { fetchUserMovies } from "@/redux/features/movies/userMovieSlice";
import { useAppDispatch } from "@/redux/hooks";

const ProfileMovies = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const [moviesList, setMoviesList] = useState<InternalMovie[]>([]);
  const [moviesUserList, setMoviesUserList] = useState<InternalMovieUser[]>([]);

  const fetchAllMovies = async () => {
    const results = await getAllMovies();
    setMoviesList(results);
  };

  const fetchUserMoviesT = async () => {
    if (session) {
      const results = await getUserMovies(session?.user.id);
      setMoviesUserList(results?.movies);
    }
  };

  useEffect(() => {
    fetchAllMovies();

    if (session) {
      fetchUserMoviesT();
      dispatch(fetchUserMovies(session?.user.id));
    }
  }, [session]);

  if (!session) {
    return <div>Vous devez être authentifé pour accéder à cette page</div>;
  }

  console.log("moviesList", moviesList, "moviesUserList", moviesUserList);

  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <WorkInProgress />
      </Suspense>
    </div>
  );
};

export default ProfileMovies;
