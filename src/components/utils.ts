import type { MediaDetails, SearchResult } from "../types";
export function detailsToSearchResult(
  details: MediaDetails,
  mediaType: string
) {
  const result: SearchResult = {
    media_type: mediaType,
    adult: details.adult,
    backdrop_path: details.backdrop_path || null,
    poster_path: details.poster_path || null,
    profile_path: details.profile_path || null,
    genre_ids: details.genres.map((g) => g.id),
    id: details.id,
    original_language: details.original_language || null,
    original_title: details.original_title || null,
    overview: details.overview,
    popularity: details.popularity,
    release_date: details.release_date || null,
    // title: details.title,
    // name: details.name,
    // video: details.video,
    vote_average: details.vote_average || null,
    vote_count: details.vote_count || null,
  };
  // Avoid values that are undefined
  if (details.name) result.name = details.name;
  if (details.title) result.title = details.title;
  if (details.video) result.video = details.video;

  Object.entries(result).forEach(([key, value]) => {
    if (value === undefined) {
      console.warn("WARNING!", { key, value });
    }
  });

  return result;
}

export function rememberLastLogin(email: string) {
  try {
    localStorage.setItem("last_login", email);
    return true;
  } catch (err) {
    console.error("Unable to local store the last_login", err);
    return false;
  }
}

export function getLastLogin() {
  try {
    const v = localStorage.getItem("last_login");
    if (v) return v;
    return "";
  } catch (err) {
    console.error("Unable to local store the last_login", err);
    return "";
  }
}
