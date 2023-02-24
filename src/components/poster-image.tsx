import Image from "next/image";
import type { Config, MediaDetails, SearchResult } from "@/types";
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
      <picture className={styles.poster_image}>
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

export function SimplePosterImage({
  config,
  alt,
  backdrop_path,
  poster_path,
  profile_path,
  lazyLoad,
}: {
  config: Config;
  alt?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  profile_path?: string | null;
  lazyLoad?: boolean;
}) {
  if (!backdrop_path && !poster_path && !profile_path) {
    return null;
  }
  let largeAsPossible: string | undefined;
  let smallAsPossible = "";
  if (backdrop_path) {
    largeAsPossible = config.images.backdrop_sizes
      .filter((x) => x !== "original")
      .at(-1);
    smallAsPossible = config.images.backdrop_sizes[0];
  } else if (poster_path) {
    largeAsPossible = config.images.poster_sizes
      .filter((x) => x !== "original")
      .at(-1);
    smallAsPossible = config.images.poster_sizes[0];
  } else if (profile_path) {
    largeAsPossible = config.images.profile_sizes
      .filter((x) => x !== "original")
      .at(-1);
    smallAsPossible = config.images.profile_sizes[0];
  }

  const start = config.images.secure_base_url || "https://image.tmdb.org/t/p/";
  const end = backdrop_path || poster_path || profile_path;
  const large = largeAsPossible ? start + largeAsPossible + end : null;
  const small = start + smallAsPossible + end;

  return (
    <picture className={styles.simple_poster_image}>
      {large && <source srcSet={large} media="(min-width: 1200px)" />}
      <source srcSet={small} media="(min-width: 600px)" />
      <img
        loading={lazyLoad ? "lazy" : undefined}
        decoding={lazyLoad ? "async" : undefined}
        src={small}
        alt={alt}
      />
    </picture>
  );
}
