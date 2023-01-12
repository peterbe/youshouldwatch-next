import { NextApiRequest, NextApiResponse } from "next";
import { search } from "../../../lib/themoviedb";

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

    if (!["multi", "movie", "tv"].includes(searchType)) {
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
    res.status(200).json(r);
  } else {
    console.warn(`Unrecognized lookup '${lookup}'`);

    res.status(404).json({ error: `Bad lookup value (${lookup})` });
  }
}
