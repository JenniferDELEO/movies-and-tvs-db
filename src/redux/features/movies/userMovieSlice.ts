import { getUserMovies } from "@/libs/sanity/api/movie";
import { InternalMovieUser } from "@/models/movies";
import { createAppSlice } from "@/redux/createAppSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface UserMovieSliceState {
  userMovies: InternalMovieUser[];
  status: "idle" | "loading" | "failed";
}

const initialState: UserMovieSliceState = {
  userMovies: [],
  status: "idle",
};

export const fetchUserMovies = createAsyncThunk(
  "movies/fetchUserMovies",
  async (userId: string) => {
    const internalUserMovies = await getUserMovies(userId);
    return internalUserMovies;
  },
);

export const userMovieSlice = createAppSlice({
  name: "userMovies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserMovies.fulfilled, (state, action) => {
        state.status = "idle";
        state.userMovies = action.payload.movies;
      })
      .addCase(fetchUserMovies.rejected, (state) => {
        state.status = "failed";
      });
  },
});
