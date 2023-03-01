import { notFound } from "next/navigation";
import { Share } from "@/components/share";

import type { MediaType } from "@/types";
import { getConfig, getDetails, getGenres } from "@/lib/themoviedb";

export default async function Page({
  params,
}: {
  params: {
    type: string;
    id: string;
  };
}) {
  if (
    !(
      params.type === "movie" ||
      params.type === "tv" ||
      params.type === "person"
    )
  ) {
    return notFound();
  }
  const mediaType: MediaType = params.type;
  const id = parseInt(params.id);
  if (!Number.isInteger(id) || id < 0) {
    return notFound();
  }

  const [config, genres, details] = await Promise.all([
    getConfig(),
    getGenres(),
    getDetails(mediaType, id),
  ]);

  return (
    <Share
      mediaType={mediaType}
      id={id}
      config={config}
      details={details}
      genres={genres}
    />
  );
}
