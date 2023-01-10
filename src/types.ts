export type MediaType = "movie" | "tv";

export type Config = {
  change_keys: string[];
  images: {
    backdrop_sizes: string[];
    base_url: string;
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    secure_base_url: string;
    still_sizes: string[];
  };
};

export type ConfigResponse = {
  data: Config;
};

export type SearchResult = {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  media_type: string; // should it be 'movie' | 'tvshow' ...
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title?: string; // movies
  name?: string; // tv
  video: boolean;
  vote_average: number;
  vote_count: number;
  first_air_date?: string;
};

export type SearchResults = {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
};

export type Genre = {
  [key: number]: string;
};
export type Genres = {
  genres: {
    id: number;
    name: string;
  }[];
};

// export type GenresResponse = {
//   genres: {
//     id: number;
//     name: string;
//   }[];
// };

export type Languages = {
  iso_639_1: string;
  english_name: string;
  name?: string;
}[];

// export type Genre = {
//   id: number;
//   name: string;
// };

// export type Genres = Genre[];

type _Collection = {
  id: number;
  name: string;
  backdrop_path: string | null;
  poster_path: string | null;
};
type _ProductionCompany = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string; // ISO string?
};

type _ProductionCountry = {
  iso_3166_1: string; // ISO string?
  name: string;
};

type _SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type MediaDetails = Genres & {
  id: number;
  name: string;
  backdrop_path: string | null;
  poster_path: string | null;
  adult: boolean;
  belongs_to_collection: null | _Collection;
  budget?: number;
  homepage: string | null;
  imdb_id: string | null;

  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  production_companies: _ProductionCompany[];
  production_countries: _ProductionCountry[];
  release_date: string;
  revenue?: number;
  runtime: number | null;
  spoken_languages: _SpokenLanguage[];
  status: string;

  tagline: string | null;
  title?: string;

  video: boolean;
  vote_average?: number;
  vote_count?: number;
};

export type MovieData = MediaDetails & {};

export type TVData = MediaDetails & {};
