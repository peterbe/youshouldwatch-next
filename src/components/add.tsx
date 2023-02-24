"use client";

import { useEffect, useState } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";

import { useDebounce } from "../app/hooks";
import type {
  Config,
  Genre,
  Languages,
  SearchResults,
  SearchType,
} from "../types";

import { font } from "./font";
import { DisplaySearchResults } from "./display-search-result";
import styles from "./add.module.css";
import { DisplayError } from "./display-error";
import { fetcher } from "./utils";

type Props = {
  config: Config;
  genres: Genre;
  languages: Languages;
};

export function Add({ config, genres, languages }: Props) {
  return (
    <div>
      <h2 className={font.className}>Add/Find</h2>
      <Form config={config} genres={genres} languages={languages} />
    </div>
  );
}

function Form({
  config,
  genres,
  languages,
}: {
  config: Config;
  genres: Genre;
  languages: Languages;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams && searchParams.get("search");
  const [search, setSearch] = useState(initialSearch || "");
  const debouncedSearch = useDebounce(search, 200);
  const initialSearchType = searchParams && searchParams.get("type");
  const [searchType, setSearchType] = useState<SearchType>(
    initialSearchType === "movie" ||
      initialSearchType === "tv" ||
      initialSearchType === "person"
      ? initialSearchType
      : ""
  );
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const sp = new URLSearchParams(searchParams || {});
    if (searchType) {
      if (sp.get("type") !== searchType) {
        if (sp.get("type") && !searchType) {
          sp.delete("type");
        } else {
          sp.set("type", searchType);
        }
      }
      const nextURL = `${pathname}?${sp}`;
      router.replace(nextURL);
    } else if (sp.get("type")) {
      sp.delete("type");
      const nextURL = `${pathname}?${sp}`;
      router.replace(nextURL);
    }
  }, [searchType, pathname, router, searchParams]);

  const { data, error, isLoading } = useSWR<SearchResults, Error>(
    debouncedSearch.trim()
      ? `/api/themoviedb/search?${new URLSearchParams({
          query: debouncedSearch.trim(),
          searchType,
          region,
          language,
        })}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
      // Treat it as immutable
      // https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
      revalidateOnFocus: process.env.NODE_ENV === "development",
      revalidateIfStale: process.env.NODE_ENV === "development",
      revalidateOnReconnect: process.env.NODE_ENV === "development",
    }
  );

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (search.trim()) {
            const sp = new URLSearchParams({ search });
            if (searchType) {
              sp.set("type", searchType);
            }
            router.push(`${pathname}?${sp}`);
          }
        }}
      >
        <input
          type="search"
          id="search"
          name="search"
          placeholder="Type name of movie or TV show"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="add-search"
          onBlur={() => {
            const existing = (searchParams && searchParams.get("search")) || "";
            if (search !== existing) {
              const sp = new URLSearchParams({ search });
              if (searchType) {
                sp.set("type", searchType);
              }
              router.replace(`${pathname}?${sp}`);
            }
          }}
        />

        <div className="grid">
          <div>
            <fieldset>
              <label htmlFor="type_multi" className={styles.type_label}>
                <input
                  type="radio"
                  id="type_multi"
                  name="type"
                  value="multi"
                  checked={searchType === ""}
                  onChange={() => setSearchType("")}
                />
                Both
              </label>
              <label htmlFor="type_movie" className={styles.type_label}>
                <input
                  type="radio"
                  id="type_movie"
                  name="type"
                  value="movie"
                  checked={searchType === "movie"}
                  onChange={() => setSearchType("movie")}
                />
                Movie
              </label>
              <label htmlFor="type_tv" className={styles.type_label}>
                <input
                  type="radio"
                  id="type_tv"
                  name="type"
                  value="tv"
                  checked={searchType === "tv"}
                  onChange={() => setSearchType("tv")}
                />
                TV show
              </label>
              <label htmlFor="type_person" className={styles.type_label}>
                <input
                  type="radio"
                  id="type_person"
                  name="type"
                  value="person"
                  checked={searchType === "person"}
                  onChange={() => setSearchType("person")}
                />
                Person
              </label>
            </fieldset>
          </div>
          <div>
            {data && (
              <p className={styles.found_total_results}>
                Found {data.total_results.toLocaleString()} results
              </p>
            )}
          </div>
        </div>
        {/* <div className="grid">
          <div>
            <fieldset>
              <label htmlFor="type_multi">
                <input
                  type="radio"
                  id="type_multi"
                  name="type"
                  value="multi"
                  checked={searchType === ""}
                  onChange={() => setSearchType("")}
                />
                Both
              </label>
              <label htmlFor="type_movie">
                <input
                  type="radio"
                  id="type_movie"
                  name="type"
                  value="movie"
                  checked={searchType === "movie"}
                  onChange={() => setSearchType("movie")}
                />
                Movie
              </label>
              <label htmlFor="type_tv">
                <input
                  type="radio"
                  id="type_tv"
                  name="type"
                  value="tv"
                  checked={searchType === "tv"}
                  onChange={() => setSearchType("tv")}
                />
                TV show
              </label>
            </fieldset>
          </div>
          <div>
            <label htmlFor="language">Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
              }}
            >
              <option value="">Any</option>
              {languages
                .sort((a, b) => a.english_name.localeCompare(b.english_name))
                .map((lang) => (
                  <option key={lang.iso_639_1} value={lang.iso_639_1}>
                    {lang.english_name} {lang.name && `(${lang.name})`}
                  </option>
                ))}
            </select>
          </div>
        </div> */}
      </form>

      {isLoading && !data && <article aria-busy="true">Loading</article>}

      {error && (
        <DisplayError
          error={error}
          title="Unable to complete the search"
          closeError={() => {
            window.location.reload();
          }}
        />
      )}

      {data && !error && (
        <DisplaySearchResults
          data={data}
          config={config}
          genres={genres}
          mediaType={searchType}
        />
      )}
    </div>
  );
}
