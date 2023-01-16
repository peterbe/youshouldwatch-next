"use client";
import { useContext } from "react";
import { font } from "./font";
import { FirebaseContext } from "../app/firebase-provider";
import { DisplayResult } from "./display-search-result";
import type { StoredSearchResult, Config, Genre, Languages } from "../types";

type Props = {
  config: Config;
  genres: Genre;
  languages: Languages;
};

export function Home({ config, genres, languages }: Props) {
  const { list, isLoading } = useContext(FirebaseContext);

  return (
    <div>
      <h1 className={font.className}>You Should Watch</h1>

      {isLoading && <p aria-busy="true">Hang on...</p>}
      {list.length === 0 && !isLoading && (
        <p>
          <i>You currently have no movies or TV shows on your list</i>
        </p>
      )}

      {list.length > 0 && (
        <ShowList results={list} config={config} genres={genres} />
      )}
    </div>
  );
}

function ShowList({
  results,
  config,
  genres,
}: {
  results: StoredSearchResult[];
  config: Config;
  genres: Genre;
}) {
  return (
    <div>
      {results.map((result, i) => (
        <DisplayResult
          key={result.id}
          index={i}
          config={config}
          result={result.result}
          genres={genres}
        />
      ))}
    </div>
  );
}
