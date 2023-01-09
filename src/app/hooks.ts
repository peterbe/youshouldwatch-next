import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import type {
  Config,
  SearchResults,
  Genre,
  Genres,
  MovieData,
  TVData,
} from "../types";

export function useConfig() {
  return useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const { data } = await axios.get<Config>("/api/themoviedb/config");
      return data;
    },
  });
}
export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const combined: Genre = {};
      const { data } = await axios.get<Genres>("/api/themoviedb/movie-genres");

      for (const each of data.genres) {
        combined[each.id] = each.name;
      }

      const { data: tvData } = await axios.get<Genres>(
        "/api/themoviedb/tv-genres"
      );
      for (const each of tvData.genres) {
        if (each.id in combined && combined[each.id] !== each.name) {
          throw new Error("Clashing genre IDs across movies and TV");
        }
        combined[each.id] = each.name;
      }
      return combined;
    },
  });
}

export function useSearch(
  isEnabled: boolean,
  query: string,
  searchType: string = "",
  region: string = ""
) {
  return useQuery({
    queryKey: ["search", query, searchType, region],
    queryFn: async () => {
      const { data } = await axios.get<SearchResults>(
        `/api/themoviedb/search?${new URLSearchParams({
          query,
          searchType,
          region,
        })}`
      );
      return data;
    },
    enabled: isEnabled,
  });
}

export function useMovie(isEnabled: boolean, id: number) {
  return useQuery({
    queryKey: ["movie", `${id}`],
    queryFn: async () => {
      const { data } = await axios.get<MovieData>(
        `/api/themoviedb/movie?${new URLSearchParams({
          id: `${id}`,
        })}`
      );
      return data;
    },
    enabled: isEnabled,
  });
}

export function useTVShow(isEnabled: boolean, id: number) {
  return useQuery({
    queryKey: ["tv", `${id}`],
    queryFn: async () => {
      const { data } = await axios.get<TVData>(
        `/api/themoviedb/tv?${new URLSearchParams({
          id: `${id}`,
        })}`
      );
      return data;
    },
    enabled: isEnabled,
  });
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
