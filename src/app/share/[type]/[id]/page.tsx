import { notFound } from "next/navigation";
import { Share } from "../../../../components/share";

import type { MediaType } from "../../../../types";
import { getConfig, getDetails } from "../../../../lib/themoviedb";

export default async function Page({
  params,
}: {
  params: {
    type: string;
    id: string;
  };
}) {
  if (!(params.type === "movie" || params.type === "tv")) {
    return notFound();
  }
  const mediaType: MediaType = params.type;
  const id = parseInt(params.id);
  if (!Number.isInteger(id) || id < 0) {
    return notFound();
  }

  const [config, details] = await Promise.all([
    getConfig(),
    getDetails(mediaType, id),
  ]);

  return (
    <Share mediaType={mediaType} id={id} config={config} details={details} />
  );
}
