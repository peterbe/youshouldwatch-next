import axios from "axios";

import type {
  Config,
  Genres,
  Genre,
  MediaDetails,
  Languages,
  MediaType,
} from "../types";

const API_KEY = process.env.THEMOVIEDB_API_KEY;

if (!API_KEY) {
  throw new Error("process.env.THEMOVIEDB_API_KEY not available!");
}

let _configCache: Config | null = null;
export async function getConfig() {
  if (!API_KEY) {
    throw new Error("Not configured");
  }
  if (_configCache) return _configCache;

  const sp = new URLSearchParams({ api_key: API_KEY });
  const url = `https://api.themoviedb.org/3/configuration?${sp}`;
  const r = await axios.get<Config>(url);
  _configCache = r.data;
  return r.data;
}

let _genresCache: Genre | null = null;
export async function getGenres() {
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
}

let _languagesCache: Languages | null = null;
export async function getLanguages() {
  if (!API_KEY) {
    throw new Error("Not configured");
  }
  if (_languagesCache) return _languagesCache;

  const sp = new URLSearchParams({ api_key: API_KEY });
  const url = `https://api.themoviedb.org/3/configuration/languages?${sp}`;
  const r = await axios.get<Languages>(url);
  _languagesCache = r.data;
  return r.data;
}

export async function getDetails(mediaType: MediaType, id: number) {
  if (!API_KEY) {
    throw new Error("Not configured");
  }
  const sp = new URLSearchParams({ api_key: API_KEY });
  const url = `https://api.themoviedb.org/3/${mediaType}/${id}?${sp}`;
  console.log(url);

  const r = await axios.get<MediaDetails>(url);
  return r.data;
}
