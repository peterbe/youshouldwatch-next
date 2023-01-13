import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { FirebaseContext } from "../app/firebase-provider";
import type { Config, SearchResults, SearchResult } from "../types";

import { font } from "./font";
import { PosterImage } from "./poster-image";

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
      <h3 className={font.className}>{result.title || result.name}</h3>

      <PosterImage index={index} result={result} config={config} />
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
      <br />

      <Link
        href={`/share/${mediaType}/${result.id}`}
        role="button"
        data-testid="share-link"
      >
        Share
      </Link>
    </article>
  );
}
