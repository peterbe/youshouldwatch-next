import Image from "next/image";

import styles from "./display.module.css";

const WIDTH = 25;
const HEIGHT = WIDTH;

export function DisplayMediaTypeIcon({ mediaType }: { mediaType: string }) {
  if (mediaType === "movie") {
    return (
      <Image
        className={styles.media_icon}
        src="/movie.png"
        alt="Movie icon"
        width={WIDTH}
        height={HEIGHT}
      />
    );
  }
  if (mediaType === "tv") {
    return (
      <Image
        className={styles.media_icon}
        src="/tv.png"
        alt="TV icon"
        width={WIDTH}
        height={HEIGHT}
      />
    );
  }

  if (mediaType === "person") {
    return (
      <Image
        className={styles.media_icon}
        src="/actor.png"
        alt="Person"
        width={WIDTH}
        height={HEIGHT}
      />
    );
  }

  return null;
}
