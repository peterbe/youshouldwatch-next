import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.THEMOVIEDB_API_KEY;

if (!API_KEY) {
  console.warn("API KEY not available!");
}

const _cache = new Map();

async function get(url: string) {
  if (process.env.NODE_ENV === "development") {
    const cached = _cache.get(url);
    if (cached) return cached;
  }

  console.time(url.split("?")[0]);
  const r = await axios.get(url);
  console.timeEnd(url.split("?")[0]);
  _cache.set(url, r.data);
  return r.data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!API_KEY) return res.status(500).send("No API_KEY");

  const { lookup } = req.query;
  const sp = new URLSearchParams({ api_key: API_KEY });

  if (lookup === "config") {
    const url = `https://api.themoviedb.org/3/configuration?${sp}`;
    const r = await get(url);
    res.status(200).json(r);
  } else if (lookup === "search") {
    let { query, region, searchType } = req.query;
    if (!(typeof query === "string" && query)) {
      return res.status(400).json({ error: `'query'` });
    }
    if (Array.isArray(searchType)) {
      searchType = searchType[0];
    }
    if (!searchType) {
      searchType = "multi";
    }
    if (!["multi", "movie", "tv"].includes(searchType)) {
      return res.status(400).json({ error: `'query'` });
    }
    // const sp = new URLSearchParams({ api_key: API_KEY, query });
    sp.set("query", query);
    if (region) {
      if (Array.isArray(region)) region = region[0];
      if (region) {
        sp.set("region", region);
      }
    }

    const url = `https://api.themoviedb.org/3/search/${searchType}?${sp}`;
    const r = await get(url);
    res.status(200).json(r);
  } else if (lookup === "movie-genres") {
    const url = `https://api.themoviedb.org/3/genre/movie/list?${sp}`;
    const r = await get(url);
    res.status(200).json(r);
  } else if (lookup === "tv-genres") {
    const url = `https://api.themoviedb.org/3/genre/tv/list?${sp}`;
    const r = await get(url);
    res.status(200).json(r);
  } else if (lookup === "movie") {
    let { id } = req.query;
    const url = `https://api.themoviedb.org/3/movie/${id}?${sp}`;
    const r = await get(url);
    res.status(200).json(r);
  } else {
    console.warn(`Unrecognized lookup '${lookup}'`);

    res.status(404).json({ error: `Bad lookup value (${lookup})` });
  }
}
