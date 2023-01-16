import type { Genre, SearchResult } from "../types";
import styles from "./display.module.css";

export function Facts({
  result,
  genres,
}: {
  result: SearchResult;
  genres: Genre;
}) {
  const resolvedGenres = (result.genre_ids || [])
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

function YearsAgo({ date }: { date: string }) {
  const d = new Date(date);
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
