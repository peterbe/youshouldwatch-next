"use client";

import { useEffect, useState } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useDebounce, useSearch } from "../app/hooks";
import type { Config, Genre, Languages } from "../types";

import { font } from "./font";
import { DisplaySearchResults } from "./display-search-result";

const queryClient = new QueryClient();

type Props = {
  config: Config;
  genres: Genre;
  languages: Languages;
};

export function Add({ config, genres, languages }: Props) {
  return (
    <div>
      <h2 className={font.className}>Add/Find</h2>
      <QueryClientProvider client={queryClient}>
        <Form config={config} genres={genres} languages={languages} />
      </QueryClientProvider>
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

  const initialSearch = searchParams.get("search");
  const [search, setSearch] = useState(initialSearch || "");
  const debouncedSearch = useDebounce(search);
  const initialSearchType = searchParams.get("type");
  const [searchType, setSearchType] = useState<"" | "movie" | "tv">(
    initialSearchType === "movie" || initialSearchType === "tv"
      ? initialSearchType
      : ""
  );
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const sp = new URLSearchParams(searchParams);
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

  const searched = useSearch(Boolean(debouncedSearch.trim()), debouncedSearch, {
    searchType,
    language,
    region,
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const sp = new URLSearchParams({ search });
        if (searchType) {
          sp.set("type", searchType);
        }
        router.push(`${pathname}?${sp}`);
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
      />

      <div className="grid">
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
      </div>

      {/* {isLoading && <article aria-busy="true">Loading</article>} */}

      {searched.status === "success" && searched.data && config && (
        <DisplaySearchResults
          data={searched.data}
          config={config}
          genres={genres}
        />
      )}
    </form>
  );
}
