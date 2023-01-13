"use client";
import { useContext } from "react";
import { font } from "./font";
import { FirebaseContext } from "../app/firebase-provider";
import { DisplayResult } from "./display-search-result";
import type { SearchResult, Config, Genre, Languages } from "../types";

type Props = {
  config: Config;
  genres: Genre;
  languages: Languages;
};

export function Home({ config, genres, languages }: Props) {
  const { list } = useContext(FirebaseContext);

  return (
    <div>
      <h1 className={font.className}>You Should Watch</h1>

      {list.length === 0 ? (
        <p>
          <i>You currently have no movies or shows on your list</i>
        </p>
      ) : (
        <ShowList results={list} config={config} />
      )}

      {/* <b>DB:</b>
      <pre>{JSON.stringify(list, undefined, 2)}</pre> */}
    </div>
  );
}

function ShowList({
  results,
  config,
}: {
  results: SearchResult[];
  config: Config;
}) {
  return (
    <div>
      {results.map((result, i) => (
        <DisplayResult
          key={result.id}
          index={i}
          config={config}
          result={result}
        />
      ))}
    </div>
  );
}
