import { defineField } from "sanity";

const userMovie = {
  name: "user_movie",
  title: "User Movie",
  type: "document",
  fields: [
    defineField({
      name: "user_name",
      title: "User Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "movies",
      title: "Movies",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "movie_title",
              title: "Movie Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "tmdb_id",
              title: "TMDB ID",
              type: "number",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "account_states",
              title: "Account States",
              type: "object",
              fields: [
                {
                  name: "status",
                  title: "Status",
                  type: "string",
                  options: {
                    list: ["watched", "to_watch"],
                  },
                },
              ],
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
};

export default userMovie;
