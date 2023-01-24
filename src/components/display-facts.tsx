import Link from "next/link";

import type { Genre, SearchResult, Config } from "../types";
import styles from "./display.module.css";
import { PosterImage } from "./poster-image";

export function Facts({
  result,
  genres,
  config,
}: {
  result: SearchResult;
  genres: Genre;
  config: Config;
}) {
  const resolvedGenres = Array.from(new Set(result.genre_ids || []))
    .map((id) => genres[id])
    .filter(Boolean);

  return (
    <div className={styles.facts}>
      {result.media_type && (
        <p>
          <b>Type</b> <i>{result.media_type}</i>
        </p>
      )}
      {result.overview && (
        <p>
          <b>Overview</b>
          <i>{result.overview}</i>
        </p>
      )}
      {result.biography && (
        <p>
          <b>Biography</b>
          <i>{result.biography}</i>
        </p>
      )}
      {result.birthday && (
        <p>
          <b>Birthday</b>
          <i>{result.birthday}</i> <YearsAgo date={result.birthday} />
        </p>
      )}
      {result.deathday && (
        <p>
          <b>Died</b>
          <i>{result.deathday}</i> <YearsAgo date={result.deathday} />
        </p>
      )}
      {result.known_for && result.known_for.length > 0 && (
        <KnownFor results={result.known_for} config={config} />
      )}
      {resolvedGenres.length > 0 && (
        <p>
          <b>Genre</b>
          {resolvedGenres.map((genre, i, L) => {
            return (
              <span key={genre} style={{ paddingRight: 5 }}>
                {genre}
                {i < L.length - 1 ? ", " : ""}
              </span>
            );
          })}
        </p>
      )}
      {result.release_date && (
        <p>
          <b>Release date</b>
          <span>{result.release_date}</span>{" "}
          <YearsAgo date={result.release_date} />
        </p>
      )}
      {result.original_title &&
        result.original_title !== (result.title || result.name) && (
          <p>
            <b>Original title</b>
            <span>{result.original_title}</span>
          </p>
        )}

      {result.adult && (
        <p>
          <b>Adult</b>
        </p>
      )}
    </div>
  );
}
function KnownFor({
  results,
  config,
}: {
  results: SearchResult[];
  config: Config;
}) {
  return (
    <div>
      <p>
        <b>Known for</b>
      </p>

      <div className="grid">
        {results.map((result, i) => {
          return (
            <div key={result.id}>
              <Link href={`/share/${result.media_type}/${result.id}`}>
                <PosterImage
                  index={i}
                  result={result}
                  config={config}
                  smallAsPossible={true}
                />
              </Link>
              <br />
              <Link href={`/share/${result.media_type}/${result.id}`}>
                {result.title || result.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function YearsAgo({ date }: { date: string }) {
  if (!date) return null;
  let d: Date | null = null;
  try {
    d = new Date(date);
  } catch {
    return null;
  }
  const ageSeconds = (new Date().getTime() - d.getTime()) / 1000;

  const future = ageSeconds < 0;

  const ageMinutes = Math.abs(ageSeconds) / 60;
  const ageHours = ageMinutes / 60;
  const ageDays = ageHours / 24;
  if (ageDays < 30) {
    return (
      <span className={styles.years_ago}>
        {future && "in "}
        less than a month {!future && "ago"}
      </span>
    );
  }
  const ageMonths = ageDays / 30;
  if (ageMonths < 12) {
    const months = Math.floor(ageMonths);
    return (
      <span className={styles.years_ago}>
        {future && "in "}
        {months} months {!future && "ago"}
      </span>
    );
  }
  const ageYears = ageDays / 365;
  const years = Math.floor(ageYears);
  return (
    <span className={styles.years_ago}>
      {future && "in "}
      {years} years {!future && "ago"}
    </span>
  );
}
