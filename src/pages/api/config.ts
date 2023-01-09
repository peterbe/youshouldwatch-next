import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.THEMOVIEDB_API_KEY;

if (!API_KEY) {
  console.warn("API KEY not available!");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!API_KEY) {
    return res.status(500).send("No API_KEY");
  }

  const sp = new URLSearchParams({ api_key: API_KEY });
  const r = await axios.get(`https://api.themoviedb.org/3/configuration?${sp}`);
  res.status(200).json(r.data);
}
