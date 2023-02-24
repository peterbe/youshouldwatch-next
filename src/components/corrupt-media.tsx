import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { useContext } from "react";

import type { SearchResult, SearchResults } from "@/types";
import { DisplayError } from "./display-error";
import { FirebaseContext } from "@/app/firebase-provider";
import { fetcher } from "./utils";

export function CorruptMedia({ result }: { result: SearchResult }) {
  const { addToList, removeFromList } = useContext(FirebaseContext);

  const [fix, setFix] = useState(false);
  const query = result.title || result.name;
  const apiURL =
    fix && query
      ? `/api/themoviedb/search?${new URLSearchParams({
          query,
        })}`
      : null;

  const { data, error, isLoading } = useSWR<SearchResults, Error>(
    apiURL,
    fetcher
  );

  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    if (data && result) {
      // Try to find a perfect match
      for (const r of data.results) {
        if (query === r.title || r.name) {
          addToList(r);
          console.log("Was able to fix!");
          setFixed(true);
          break;
        }
      }
    }
  }, [data, result]);

  return (
    <div>
      <h3>So sorry!</h3>
      <p>
        It appears this was added before it was recorded if it was a movie or a
        TV show.
      </p>

      {error && (
        <DisplayError
          error={error}
          title="Unable to fix"
          closeError={() => {
            mutate(apiURL);
          }}
        />
      )}

      {query && isLoading && <p aria-busy="true">Trying to fix</p>}

      {query && !isLoading && (
        <button
          onClick={() => {
            setFix(true);
          }}
        >
          Try to fix it
        </button>
      )}

      <button
        onClick={() => {
          removeFromList(result).then(() => {
            window.location.reload();
          });
        }}
      >
        Remove from list
      </button>
    </div>
  );
}
