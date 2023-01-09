"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Lilita_One } from "@next/font/google";
import Link from "next/link";
// import { useConfig } from "./hooks";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { useConfig, useMovie, useTVShow } from "../../../hooks";

const queryClient = new QueryClient();

// import type { Config, SearchResults, SearchResult } from "../../../../types";

// import styles from './page.module.css'

// const font = Lilita_One({ subsets: ["latin"] });
const font = Lilita_One({ weight: "400" });

type MediaType = "movie" | "tv";

export default function Share({
  params,
}: {
  params: {
    type: string;
    id: string;
  };
}) {
  // const {
  //   status: configStatus,
  //   data: config,
  //   error: configError,
  //   isFetching,
  //   isLoading: isLoadingConfig,
  // } = useConfig();
  // let isReady = configStatus === "success";

  if (!(params.type === "movie" || params.type === "tv")) {
    return (
      <div>
        <h1>Page not found</h1>
        <h2>Invalid page</h2>
      </div>
    );
  }
  const mediaType = params.type;

  const id = parseInt(params.id);
  const isInt = Number.isInteger(id) && id > 0;

  if (!isInt) {
    return (
      <div>
        <h1>Page not found</h1>
        <h2>Invalid ID</h2>
      </div>
    );
  }

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Inner mediaType={mediaType} id={id} />
      </QueryClientProvider>
    </div>
  );
}

function isInt(x: string) {
  return Number.isInteger(x);
}

function Inner({ mediaType, id }: { mediaType: MediaType; id: number }) {
  const {
    status: configStatus,
    data: config,
    error: configError,
    isFetching,
    isLoading: isLoadingConfig,
  } = useConfig();
  let isReady = configStatus === "success";

  const {
    status: movieStatus,
    data: movieData,
    error: movieError,
    // isFetching,
    // isLoading: isLoadingConfig,
  } = useMovie(isReady && mediaType === "movie", id);
  // console.log("MOVIE", movieData);
  // if (movieData) {
  //   console.log(JSON.stringify(movieData, undefined, 2));
  // }
  const {
    status: tvStatus,
    data: tvData,
    error: tvError,
    // isFetching,
    // isLoading: isLoadingConfig,
  } = useTVShow(isReady && mediaType === "tv", id);

  const hasDetails = isReady && (movieData || tvData);

  return (
    <div>
      <h1 className={font.className}>
        {!hasDetails && "Loading..."}
        {hasDetails && movieData && movieData.title}
        {hasDetails && tvData && tvData.title}
      </h1>
    </div>
  );
}
