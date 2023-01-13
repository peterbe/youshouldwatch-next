import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { FirebaseContext } from "../app/firebase-provider";
import type { Config, SearchResults, SearchResult } from "../types";

import { font } from "./font";
import { PosterImage } from "./poster-image";
import styles from "./display.module.css";

export function DisplaySearchResults({
  data,
  config,
}: {
  data: SearchResults;
  config: Config;
}) {
  return (
    <div>
      <p>Found {data.total_results.toLocaleString()} results</p>
      {data.results.map((result, i) => (
        <DisplayResult
          key={result.id}
          result={result}
          index={i}
          config={config}
        />
      ))}
    </div>
  );
}

export function DisplayResult({
  result,
  index,
  config,
}: {
  result: SearchResult;
  index: number;
  config: Config;
}) {
  const router = useRouter();
  const mediaType = result.media_type === "movie" ? "movie" : "tv";

  const { list, addToList, removeFromList } = useContext(FirebaseContext);

  const onListAlready = new Set(list.map((r) => r.id)).has(result.id);

  return (
    <article>
      <div className="grid">
        <div>
          <h2 className={font.className}>{result.title || result.name}</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          {/* {result.media_type} */}
          {result.media_type === "movie" && (
            <Image src="/movie.png" alt="Movie icon" width={50} height={50} />
          )}
          {result.media_type === "tv" && (
            <Image src="/tv.png" alt="TV icon" width={50} height={50} />
          )}
          {result.media_type === "person" && (
            <Image src="/actor.png" alt="Person" width={50} height={50} />
          )}
        </div>
      </div>

      <PosterImage index={index} result={result} config={config} />

      {(result.media_type == "movie" || result.media_type === "tv") && (
        <button
          onClick={() => {
            if (onListAlready) {
              removeFromList(result);
            } else {
              addToList(result);
            }
            // XXX why does this not work?!
            router.push("/");
          }}
        >
          {onListAlready ? "Remove from your list" : "Add to my list"}
        </button>
      )}
      <br />

      <Link
        href={`/share/${mediaType}/${result.id}`}
        role="button"
        data-testid="share-link"
      >
        Share
      </Link>

      <Facts result={result} />
    </article>
  );
}

function Facts({ result }: { result: SearchResult }) {
  return (
    <div className={styles.facts}>
      {result.overview && (
        <p>
          <b>Overview</b>
          <i>{result.overview}</i>
        </p>
      )}
      {result.genre_ids && result.genre_ids.length > 0 && (
        <p>
          <b>Genre</b>
          {result.genre_ids.map((id, i, L) => {
            // console.log(L);

            return (
              <span key={id} style={{ paddingRight: 5 }}>
                {id}
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
