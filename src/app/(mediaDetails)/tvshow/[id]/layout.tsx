import type { Metadata } from "next";

import { getTvShowDetail } from "@/libs/api/tvshows";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id.split("-")[0];

  const movieDetail = await getTvShowDetail(id);

  return {
    title: `${movieDetail.name} - Films & Séries TV DB`,
  };
}

export default function MovieDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="size-full">{children}</div>;
}