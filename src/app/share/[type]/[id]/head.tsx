import { notFound } from "next/navigation";

import DefaultTags from "../../../default-tags";
import type { MediaType } from "../../../../types";
import { getConfig, getDetails } from "../../../../lib/themoviedb";

export default async function Head({
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

  // XXX Ugh! This is not right. Want I want to do is to share the gathered
  // data from within the `src/app/share/[type]/[id]/page.tsx` function
  // here so that I don't have to repeat myself. Right now, it's busted.

  const [config, details] = await Promise.all([
    getConfig(),
    getDetails(mediaType, id),
  ]);

  const imageStart =
    config.images.secure_base_url || "https://image.tmdb.org/t/p/";
  let imageUrl = "";
  let largest = "";
  if (details.backdrop_path) {
    largest =
      config.images.backdrop_sizes.filter((x) => x !== "original").at(-1) ||
      "w500";
  } else if (details.poster_path) {
    largest =
      config.images.poster_sizes.filter((x) => x !== "original").at(-1) ||
      "w500";
  }
  if (largest && (details.backdrop_path || details.poster_path)) {
    const end = details.backdrop_path || details.poster_path;
    imageUrl = imageStart + largest + end;
  }

  const title = `You Should Watch: ${details.title || details.name}`;
  return (
    <>
      {/* Does't work :( */}
      {/* {pathname && <meta property="og:url" content={pathname} />} */}

      <meta property="og:title" content={title} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <title>{title}</title>
      <DefaultTags />
    </>
  );
}
