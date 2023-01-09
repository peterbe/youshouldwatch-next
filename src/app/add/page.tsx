"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Lilita_One } from "@next/font/google";
// import { useConfig } from "./hooks";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { useDebounce, useGenres, useConfig, useSearch } from "../hooks";
import type { Config, SearchResults, SearchResult } from "../../types";
import Link from "next/link";
const queryClient = new QueryClient();

// import styles from './page.module.css'

// const font = Lilita_One({ subsets: ["latin"] });
const font = Lilita_One({ weight: "400" });

export default function Add() {
  return (
    <div>
      <h2 className={font.className}>Add</h2>
      <QueryClientProvider client={queryClient}>
        <Form
          setFound={(found: string) => {
            console.log("FOUND:", found);
          }}
        />
      </QueryClientProvider>
    </div>
  );
}

function Form({ setFound }: { setFound: (x: string) => void }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [genre, setGenre] = useState<"" | "movies" | "tv">("");
  const [searchType, setSearchType] = useState<"" | "movie" | "tv">("");
  // const { config, isLoading, isError } = useConfig();
  const {
    status: configStatus,
    data: config,
    error: configError,
    isFetching,
    isLoading: isLoadingConfig,
  } = useConfig();

  const {
    status: genrestatus,
    data: genres,
    error: genresError,
    // isFetching,
    // isLoading: isLoadingConfig,
  } = useGenres();

  let isReady = configStatus === "success";

  const isLoading = configStatus === "loading";
  //   const isLoadingDebounced = useDebounce(!!config);
  //   console.log({ isLoading, isLoadingDebounced, isLoadingConfig, isFetching });

  //   console.log({ isReady });

  const searched = useSearch(
    isReady && Boolean(debouncedSearch.trim()),
    debouncedSearch,
    searchType
  );
  //   console.log("SEARCHED:", searched);

  //   console.log({ status, data, error, isFetching });

  return (
    <form>
      <input
        disabled={!isReady}
        type="search"
        id="search"
        name="search"
        placeholder="Type name of movie or TV show"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <fieldset>
        {/* <legend>Size</legend> */}
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

      {isLoading && <article aria-busy="true">Loading</article>}

      {searched.status === "success" && searched.data && config && (
        <DisplaySearchResults data={searched.data} config={config} />
      )}
    </form>
  );
}

function DisplaySearchResults({
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
        <Result key={result.id} result={result} index={i} config={config} />
      ))}
    </div>
  );
}

function Result({
  result,
  index,
  config,
}: {
  result: SearchResult;
  index: number;
  config: Config;
}) {
  // console.log(result);
  // console.log(result.media_type);

  const mediaType = result.media_type === "movie" ? "movie" : "tv";

  return (
    <article>
      {/* <header> */}
      <h3 className={font.className}>{result.title || result.name}</h3>
      {/* </header> */}

      <PosterImage index={index} result={result} config={config} />
      {/* <footer> */}
      <button>Add to my list</button>
      <br />

      <Link href={`/share/${mediaType}/${result.id}`} role="button">
        Share
      </Link>
      {/* </footer> */}
    </article>
  );
}

function PosterImage({
  index,
  result,
  config,
}: {
  result: SearchResult;
  index: number;
  config: Config;
}) {
  const start = config.images.secure_base_url || "https://image.tmdb.org/t/p/";

  if (result.backdrop_path || result.poster_path) {
    // https://github.com/nucliweb/image-element#with-media
    let largest = "w500";
    let small = "w500";
    let middle = "w500";
    if (result.backdrop_path) {
      largest =
        config.images.backdrop_sizes.filter((x) => x !== "original").at(-1) ||
        "w500";
      middle =
        config.images.backdrop_sizes.filter((x) => x !== "original").at(-2) ||
        "w500";
    } else if (result.poster_path) {
      largest =
        config.images.poster_sizes.filter((x) => x !== "original").at(-1) ||
        "w500";
      middle =
        config.images.poster_sizes.filter((x) => x !== "original").at(-2) ||
        "w500";
    }

    const end = result.backdrop_path || result.poster_path;
    const mobile = start + small + end;
    const tablet = start + middle + end;
    const desktop = start + largest + end;

    return (
      <picture>
        <source srcSet={desktop} media="(min-width: 1200px)" />
        <source srcSet={tablet} media="(min-width: 600px)" />
        <img
          loading={index > 2 ? "lazy" : undefined}
          decoding={index > 2 ? "async" : undefined}
          src={mobile}
          alt="Poster"
        />
      </picture>
    );
  }

  return (
    <Image
      // className={styles.logo}
      src="/camera.svg"
      alt="Has no poster image"
      width={100}
      height={100}
      // priority
    />
  );
  //   return (
  //     <img
  //       src={camera}
  //       //   class={styles.cameraPosterImage}
  //       alt="Has no poster image"
  //     />
  //   );
}
