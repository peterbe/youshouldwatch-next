import Link from "next/link";

import type {
  Config,
  Genre,
  SearchResults,
  SearchResult,
  SearchType,
} from "../types";

import { font } from "./font";
import { PosterImage } from "./poster-image";
import { Facts } from "./display-facts";
import styles from "./display.module.css";
import { AllInformation } from "./all-information";
import { ToggleToList } from "./toggle-to-list";
import { WebShare } from "./web-share";
import { TimeAgo } from "./timeago";

export function DisplaySearchResults({
  data,
  config,
  genres,
  mediaType,
}: {
  data: SearchResults;
  config: Config;
  genres: Genre;
  mediaType: SearchType;
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
          loadOnIntersection={false}
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
  loadOnIntersection,
  added,
  isArchive,
}: {
  result: SearchResult;
  index: number;
  config: Config;
  genres: Genre;
  mediaType?: SearchType;
  loadOnIntersection: boolean;
  added?: Date | null;
  isArchive?: boolean;
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

      {isArchive && added && (
        <p>
          Checked off{" "}
          <b>
            <TimeAgo date={added} />
          </b>
        </p>
      )}

      <PosterImage index={index} result={result} config={config} />
      {isMovieOrTV && (
        <AboutMedia
          result={result}
          mediaType={mediaType_}
          genres={genres}
          config={config}
          loadOnIntersection={loadOnIntersection}
          isArchive={isArchive}
        />
      )}
      {isPerson && (
        <AboutPerson
          result={result}
          genres={genres}
          config={config}
          loadOnIntersection={loadOnIntersection}
        />
      )}
    </article>
  );
}

function AboutMedia({
  result,
  mediaType,
  genres,
  config,
  loadOnIntersection,
  isArchive,
}: {
  result: SearchResult;
  mediaType: "movie" | "tv";
  genres: Genre;
  config: Config;
  loadOnIntersection: boolean;
  isArchive?: boolean;
}) {
  return (
    <div>
      <ToggleToList result={result} isArchive={isArchive} />
      <WebShare result={result} />
      <br />

      <p>
        <Link
          href={`/share/${mediaType}/${result.id}`}
          role="button"
          data-testid="goto-link"
        >
          Go to
        </Link>
      </p>

      <Facts result={result} genres={genres} config={config} />

      <AllInformation
        result={result}
        genres={genres}
        config={config}
        mediaType={mediaType}
        loadOnIntersection={loadOnIntersection}
      />
    </div>
  );
}

function AboutPerson({
  result,
  genres,
  config,
  loadOnIntersection,
}: {
  result: SearchResult;
  genres: Genre;
  config: Config;
  loadOnIntersection: boolean;
}) {
  return (
    <div>
      <p>
        <Link
          href={`/share/person/${result.id}`}
          role="button"
          data-testid="goto-link"
        >
          Go to
        </Link>
      </p>
      <Facts result={result} genres={genres} config={config} />

      <AllInformation
        mediaType="person"
        result={result}
        genres={genres}
        config={config}
        loadOnIntersection={loadOnIntersection}
      />
    </div>
  );
}
