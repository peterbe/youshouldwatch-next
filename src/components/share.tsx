"use client";
import { useContext } from "react";
import type { Config, MediaType, MediaDetails, Genre } from "../types";

import { font } from "./font";
import { PosterImage } from "./poster-image";
import { DisplayMediaTypeIcon } from "./display-media-type-icon";
import { Facts } from "./display-facts";
import { FirebaseContext } from "../app/firebase-provider";
import { detailsToSearchResult } from "./utils";

export function Share({
  mediaType,
  id,
  details,
  config,
  genres,
}: {
  mediaType: MediaType;
  id: number;
  details: MediaDetails;
  config: Config;
  genres: Genre;
}) {
  const { list, addToList, removeFromList } = useContext(FirebaseContext);

  // console.log(details);
  const result = detailsToSearchResult(details, mediaType);
  const onListAlready = new Set(list.map((r) => r.id)).has(result.id);

  // const result: SearchResult = details;
  return (
    <div>
      <div className="grid">
        <div>
          <h1 className={font.className}>{details.title || details.name}</h1>
        </div>
        <div style={{ textAlign: "right" }}>
          <DisplayMediaTypeIcon mediaType={mediaType} />
        </div>
      </div>

      <PosterImage index={0} config={config} result={details} />

      {(result.media_type == "movie" || result.media_type === "tv") && (
        <button
          onClick={() => {
            if (onListAlready) {
              removeFromList(result);
            } else {
              addToList(result);
            }
          }}
        >
          {onListAlready ? "Remove from your list" : "Add to my list"}
        </button>
      )}

      <Facts result={result} genres={genres} />
    </div>
  );
}
