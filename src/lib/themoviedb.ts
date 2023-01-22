import { cache } from "react";
import axios from "axios";

import type {
  Config,
  Genres,
  Genre,
  MediaDetails,
  Languages,
  MediaType,
  SearchResults,
} from "../types";

const API_KEY = process.env.THEMOVIEDB_API_KEY;

if (!API_KEY) {
  throw new Error("process.env.THEMOVIEDB_API_KEY not available!");
}

// The module global cache is for multiple completely different requests
let _configCache: Config | null = null;
// The cache() is for deduping requests from within 1 request, for
// example of the `head.tsx` and for the `page.tsx`.
export const getConfig = cache(async () => {
  if (!API_KEY) {
    throw new Error("Not configured");
  }
  if (_configCache) return _configCache;

  const sp = new URLSearchParams({ api_key: API_KEY });
  const url = `https://api.themoviedb.org/3/configuration?${sp}`;
  console.time(url.replace(API_KEY, "***"));
  const r = await axios.get<Config>(url);
  console.timeEnd(url.replace(API_KEY, "***"));
  _configCache = r.data;
  // console.log(r.data);

  return r.data;
});

let _genresCache: Genre | null = null;
export const getGenres = cache(async () => {
  if (!API_KEY) {
    throw new Error("Not configured");
  }
  if (_genresCache) return _genresCache;
  const combined: Genre = {};

  const sp = new URLSearchParams({ api_key: API_KEY });

  {
    let url = `https://api.themoviedb.org/3/genre/movie/list?${sp}`;
    let r = await axios.get<Genres>(url);
    const genres = r.data;
    for (const g of genres.genres) {
      combined[g.id] = g.name;
    }
  }

  {
    const url = `https://api.themoviedb.org/3/genre/tv/list?${sp}`;
    const r = await axios.get<Genres>(url);
    const genres = r.data;

    for (const each of genres.genres) {
      if (each.id in combined && combined[each.id] !== each.name) {
        throw new Error("Clashing genre IDs across movies and TV");
      }
      combined[each.id] = each.name;
    }
  }
  _genresCache = combined;
  return combined;
});

let _languagesCache: Languages | null = null;
export const getLanguages = cache(async () => {
  if (!API_KEY) {
    throw new Error("Not configured");
  }
  if (_languagesCache) return _languagesCache;

  const sp = new URLSearchParams({ api_key: API_KEY });
  const url = `https://api.themoviedb.org/3/configuration/languages?${sp}`;
  const r = await axios.get<Languages>(url);
  _languagesCache = r.data;
  return r.data;
});

export const getDetails = cache(async (mediaType: MediaType, id: number) => {
  if (!API_KEY) {
    throw new Error("Not configured");
  }
  const sp = new URLSearchParams({ api_key: API_KEY });
  const url = `https://api.themoviedb.org/3/${mediaType}/${id}?${sp}`;
  console.time(url.replace(API_KEY, "***"));
  const r = await axios.get<MediaDetails>(url);
  console.timeEnd(url.replace(API_KEY, "***"));
  return r.data;
});

export const getAllDetails = cache(async (mediaType: MediaType, id: number) => {
  if (!API_KEY) {
    throw new Error("Not configured");
  }
  const sp = new URLSearchParams({ api_key: API_KEY });

  const extra = [
    // "external_ids",
    // "images",
    // "keywords",
    "recommendations",
    // "reviews",
    // "similar",
    "videos",
    "credits",
  ];
  sp.set("append_to_response", extra.join(","));
  const url = `https://api.themoviedb.org/3/${mediaType}/${id}?${sp}`;
  console.time(url.replace(API_KEY, "***"));
  const r = await axios.get<MediaDetails>(url);
  console.timeEnd(url.replace(API_KEY, "***"));
  return r.data;
});

export const search = cache(
  async (
    query: string,
    { searchType = "", language = "", region = "" } = {}
  ) => {
    const sp = new URLSearchParams({ api_key: API_KEY });
    sp.set("query", query);
    if (region) {
      sp.set("region", region);
    }
    if (language) {
      sp.set("language", language);
    }
    const url = `https://api.themoviedb.org/3/search/${searchType}?${sp}`;
    console.time(url.replace(API_KEY, "***"));
    const r = await axios.get<SearchResults>(url);
    console.timeEnd(url.replace(API_KEY, "***"));
    return r.data;
  }
);
