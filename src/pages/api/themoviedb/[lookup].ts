import { NextApiRequest, NextApiResponse } from "next";
import { search, getAllDetails } from "../../../lib/themoviedb";
import { MediaType } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lookup } = req.query;

  if (lookup === "search") {
    let { query, region, language, searchType } = req.query;
    const opts = {
      region: "",
      searchType: "",
      language: "",
    };
    if (!(typeof query === "string" && query)) {
      return res.status(400).json({ error: `'query'` });
    }
    if (Array.isArray(searchType)) {
      searchType = searchType[0];
    }
    if (!searchType) {
      searchType = "multi";
    }

    if (!["multi", "movie", "tv", "person"].includes(searchType)) {
      return res.status(400).json({ error: `'query'` });
    }
    opts.searchType = searchType;

    if (region) {
      if (Array.isArray(region)) region = region[0];
      if (region) {
        opts.region = region;
      }
    }
    if (language) {
      if (Array.isArray(language)) language = language[0];
      if (language) {
        opts.language = language;
      }
    }

    const r = await search(query, opts);

    res.setHeader("cache-control", "public,max-age=3600");
    res.status(200).json(r);
  } else if (lookup === "alldetails") {
    let { id, mediaType } = req.query;
    if (
      typeof mediaType !== "string" ||
      !["movie", "tv", "person"].includes(mediaType)
    ) {
      return res.status(400).json({ error: `mediaType (${mediaType})` });
    }

    if (typeof id !== "string" || isNaN(parseInt(id))) {
      return res.status(400).json({ error: `id (${id})` });
    }
    const idInt = parseInt(id);
    const r = await getAllDetails(mediaType as MediaType, idInt);

    res.setHeader("cache-control", "public,max-age=3600");
    res.status(200).json(r);
  } else {
    console.warn(`Unrecognized lookup '${lookup}'`);

    res.status(404).json({ error: `Bad lookup value (${lookup})` });
  }
}
