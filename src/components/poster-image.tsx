import Image from "next/image";
import type { Config, MediaDetails, SearchResult } from "../types";

export function PosterImage({
  index,
  result,
  config,
}: {
  result: SearchResult | MediaDetails;
  index: number;
  config: Config;
}) {
  const start = config.images.secure_base_url || "https://image.tmdb.org/t/p/";

  if (result.backdrop_path || result.poster_path) {
    // https://github.com/nucliweb/image-element#with-media
    let largest = "w500";
    let small = "w500";
    let middle = "w500";
    if (result.backdrop_path) {
      largest =
        config.images.backdrop_sizes.filter((x) => x !== "original").at(-1) ||
        "w500";
      middle =
        config.images.backdrop_sizes.filter((x) => x !== "original").at(-2) ||
        "w500";
    } else if (result.poster_path) {
      largest =
        config.images.poster_sizes.filter((x) => x !== "original").at(-1) ||
        "w500";
      middle =
        config.images.poster_sizes.filter((x) => x !== "original").at(-2) ||
        "w500";
    }

    const end = result.backdrop_path || result.poster_path;
    const mobile = start + small + end;
    const tablet = start + middle + end;
    const desktop = start + largest + end;

    return (
      <picture>
        <source srcSet={desktop} media="(min-width: 1200px)" />
        <source srcSet={tablet} media="(min-width: 600px)" />
        <img
          loading={index > 2 ? "lazy" : undefined}
          decoding={index > 2 ? "async" : undefined}
          src={mobile}
          alt="Poster"
        />
      </picture>
    );
  }

  return (
    <Image
      // className={styles.logo}
      src="/camera.svg"
      alt="Has no poster image"
      width={100}
      height={100}
      // priority
    />
  );
}
