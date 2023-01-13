"use client";
import type { Config, MediaType, MediaDetails } from "../types";

import { font } from "./font";
import { PosterImage } from "./poster-image";
import { FirebaseContext } from "../app/firebase-provider";
import { useContext } from "react";

export function Share({
  mediaType,
  id,
  details,
  config,
}: {
  mediaType: MediaType;
  id: number;
  details: MediaDetails;
  config: Config;
}) {
  const { list, addToList } = useContext(FirebaseContext);

  return (
    <div>
      <h1 className={font.className}>{details.title || details.name}</h1>
      <PosterImage index={0} config={config} result={details} />
    </div>
  );
}
