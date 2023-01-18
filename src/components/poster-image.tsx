import Image from "next/image";
import type { Config, MediaDetails, SearchResult } from "../types";
import styles from "./poster.module.css";

export function PosterImage({
  index,
  result,
  config,
  smallAsPossible,
}: {
  result: SearchResult | MediaDetails;
  index: number;
  config: Config;
  smallAsPossible?: boolean;
}) {
  const start = config.images.secure_base_url || "https://image.tmdb.org/t/p/";

  let alt = "Picture";
  if (result.poster_path) alt = "Poster";
  else if (result.backdrop_path) alt = "Backdrop";
  else if (result.profile_path) alt = "Profile";

  if (result.backdrop_path || result.poster_path || result.profile_path) {
    // https://github.com/nucliweb/image-element#with-media
    let largest = "w500";
    let small = "w500";
    let middle = "w500";
    let smallest = "";
    if (result.backdrop_path) {
      largest =
        config.images.backdrop_sizes.filter((x) => x !== "original").at(-1) ||
        largest;
      middle =
        config.images.backdrop_sizes.filter((x) => x !== "original").at(-2) ||
        middle;
      smallest = config.images.backdrop_sizes[0];
    } else if (result.poster_path) {
      largest =
        config.images.poster_sizes.filter((x) => x !== "original").at(-1) ||
        largest;
      middle =
        config.images.poster_sizes.filter((x) => x !== "original").at(-2) ||
        middle;
      smallest = config.images.poster_sizes[0];
    } else if (result.profile_path) {
      largest =
        config.images.profile_sizes.filter((x) => x !== "original").at(-1) ||
        largest;
      middle =
        config.images.profile_sizes.filter((x) => x !== "original").at(-2) ||
        middle;
      smallest = config.images.profile_sizes[0];
    }

    const end =
      result.backdrop_path || result.poster_path || result.profile_path;

    if (smallAsPossible) {
      const url = start + smallest + end;
      return <img className={styles.small_as_possible} src={url} alt={alt} />;
    }

    const mobile = start + small + end; // XXX not sure this is right!
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
          alt={alt}
        />
      </picture>
    );
  }

  return (
    <span>
      <Image
        src="/watching.svg"
        alt="Has no poster image"
        width={300}
        height={200}
      />
      <i>{"Has no poster :("}</i>
    </span>
  );
}
