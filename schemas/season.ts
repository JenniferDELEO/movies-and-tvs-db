import { defineField } from "sanity";

const season = {
  name: "season",
  title: "Season",
  type: "document",
  fields: [
    defineField({
      name: "tmdb_id",
      title: "TMDB ID",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "season_number",
      title: "Season Number",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "number_of_episodes",
      title: "Number of Episodes",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "season_runtime",
      title: "Season Runtime",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tv_show",
      title: "TV Show",
      type: "reference",
      to: [{ type: "tv_show" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "episodes",
      title: "Episodes",
      type: "array",
      of: [{ type: "episode" }],
    }),
    defineField({
      name: "account_states",
      title: "Account States",
      type: "object",
      fields: [
        {
          name: "all_watched",
          title: "All Watched",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "results",
          title: "Results",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "episode_number",
                  title: "Episode Number",
                  type: "number",
                },
                {
                  name: "watched",
                  title: "Watched",
                  type: "boolean",
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
};

export default season;