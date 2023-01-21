"use client";
import { useContext } from "react";
import type { Config, MediaType, MediaDetails, Genre } from "../types";

import { font } from "./font";
import { PosterImage } from "./poster-image";
import { Facts } from "./display-facts";
import { FirebaseContext } from "../app/firebase-provider";
import { detailsToSearchResult } from "./utils";
import { GoBackHome } from "./go-back-home";
import { triggerParty } from "./party";
import { AllInformation } from "./all-information";

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

  const result = detailsToSearchResult(details, mediaType);
  const onListAlready = new Set(list.map((r) => r.result.id)).has(result.id);

  return (
    <div>
      <hgroup>
        <h1 className={font.className}>{details.title || details.name}</h1>
        <h3>{mediaType}</h3>
      </hgroup>

      <PosterImage index={0} config={config} result={details} />

      {(result.media_type == "movie" || result.media_type === "tv") && (
        <button
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
      )}

      <Facts result={result} genres={genres} config={config} />

      <AllInformation
        result={result}
        genres={genres}
        config={config}
        mediaType={mediaType}
        loadOnIntersection={true}
      />
      <GoBackHome />
    </div>
  );
}
