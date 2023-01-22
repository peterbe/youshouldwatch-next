"use client";
import type { Config, MediaType, MediaDetails, Genre } from "../types";

import { font } from "./font";
import { PosterImage } from "./poster-image";
import { Facts } from "./display-facts";
import { detailsToSearchResult } from "./utils";
import { GoBackHome } from "./go-back-home";
import { AllInformation } from "./all-information";
import { ToggleToList } from "./toggle-to-list";
import { WebShare } from "./web-share";

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
  const result = detailsToSearchResult(details, mediaType);

  return (
    <div>
      <hgroup>
        <h1 className={font.className}>{details.title || details.name}</h1>
        <h3>{mediaType}</h3>
      </hgroup>

      <PosterImage index={0} config={config} result={details} />

      {(result.media_type == "movie" || result.media_type === "tv") && (
        <>
          <ToggleToList result={result} />
          <WebShare result={result} />
        </>
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
