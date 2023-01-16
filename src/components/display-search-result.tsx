import Link from "next/link";
import { createRef, useContext, useEffect, useState } from "react";
import party from "party-js";
import type { Config, Genre, SearchResults, SearchResult } from "../types";

import { FirebaseContext } from "../app/firebase-provider";
import { font } from "./font";
import { PosterImage } from "./poster-image";
import { Facts } from "./display-facts";
import { DisplayMediaTypeIcon } from "./display-media-type-icon";

export function DisplaySearchResults({
  data,
  config,
  genres,
}: {
  data: SearchResults;
  config: Config;
  genres: Genre;
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
          genres={genres}
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
}: {
  result: SearchResult;
  index: number;
  config: Config;
  genres: Genre;
}) {
  // const router = useRouter();
  const mediaType = result.media_type === "movie" ? "movie" : "tv";

  const { list, addToList, removeFromList } = useContext(FirebaseContext);

  const onListAlready = new Set(list.map((r) => r.result.id)).has(result.id);

  return (
    <article>
      <DisplayMediaTypeIcon mediaType={result.media_type} />
      <h2 className={font.className}>{result.title || result.name}</h2>
      {/* <div className="grid">
        <div>
          <h2 className={font.className}>{result.title || result.name}</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <DisplayMediaTypeIcon mediaType={result.media_type} />
        </div>
      </div> */}

      <PosterImage index={index} result={result} config={config} />

      {(result.media_type == "movie" || result.media_type === "tv") && (
        <button
          data-testid="display-toggle"
          onClick={(event) => {
            if (onListAlready) {
              removeFromList(result);
            } else {
              addToList(result).then(() => {
                party.confetti(event.target as HTMLElement, {
                  count: 60,
                  spread: party.variation.range(40, 50),
                  speed: party.variation.range(500, 600),
                });
              });
            }
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

      <Facts result={result} genres={genres} />
    </article>
  );
}
