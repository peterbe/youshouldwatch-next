import Link from "next/link";
import { useContext } from "react";

import type { Config, Genre, SearchResults, SearchResult } from "../types";

import { FirebaseContext } from "../app/firebase-provider";
import { font } from "./font";
import { PosterImage } from "./poster-image";
import { Facts } from "./display-facts";
import { triggerParty } from "./party";
import styles from "./display.module.css";

export function DisplaySearchResults({
  data,
  config,
  genres,
  mediaType,
}: {
  data: SearchResults;
  config: Config;
  genres: Genre;
  mediaType: "movie" | "tv" | "";
}) {
  return (
    <div>
      {data.results.map((result, i) => (
        <DisplayResult
          key={result.id}
          result={result}
          index={i}
          config={config}
          genres={genres}
          mediaType={mediaType}
        />
      ))}
    </div>
  );
}

export function DisplayResult({
  result,
  index,
  config,
  genres,
  mediaType,
}: {
  result: SearchResult;
  index: number;
  config: Config;
  genres: Genre;
  mediaType?: "movie" | "tv" | "";
}) {
  // When you make a Multi search, each result will have a `media_type`
  // which will be 'movie', 'tv', or 'person'.
  // But if the user selected, for example, "TV Show", the search
  // will explicitly be a 'tv' search and this won't be repeated in the
  // search results because that would be redundant.
  // In that case, we take it from the search form.
  const mediaType_ = mediaType || result.media_type;

  const isMovieOrTV = mediaType_ == "movie" || mediaType_ === "tv";
  const isPerson = mediaType_ === "person";

  return (
    // IDEA: Perhaps set the fade in animation with IntersectionObserver
    <article className={styles.result}>
      <hgroup>
        <h2 className={font.className}>{result.title || result.name}</h2>
        <h3>{mediaType_}</h3>
      </hgroup>

      <PosterImage index={index} result={result} config={config} />
      {isMovieOrTV && (
        <AboutMedia
          result={result}
          mediaType={mediaType_}
          genres={genres}
          config={config}
        />
      )}
      {isPerson && (
        <AboutPerson result={result} genres={genres} config={config} />
      )}
    </article>
  );
}

function AboutMedia({
  result,
  mediaType,
  genres,
  config,
}: {
  result: SearchResult;
  mediaType: "movie" | "tv";
  genres: Genre;
  config: Config;
}) {
  const { list, addToList, removeFromList } = useContext(FirebaseContext);
  const onListAlready = new Set(list.map((r) => r.result.id)).has(result.id);

  return (
    <div>
      <button
        data-testid="display-toggle"
        onClick={(event) => {
          if (onListAlready) {
            removeFromList(result);
          } else {
            addToList(result).then(() => {
              triggerParty(event.target as HTMLElement);
            });
          }
        }}
      >
        {onListAlready ? "Remove from your list" : "Add to my list"}
      </button>
      <br />

      <Link
        href={`/share/${mediaType}/${result.id}`}
        role="button"
        data-testid="share-link"
      >
        Share
      </Link>

      <Facts result={result} genres={genres} config={config} />
    </div>
  );
}

function AboutPerson({
  result,
  genres,
  config,
}: {
  result: SearchResult;
  genres: Genre;
  config: Config;
}) {
  return (
    <div>
      <Facts result={result} genres={genres} config={config} />
    </div>
  );
}
