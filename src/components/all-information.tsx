import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import LiteYouTubeEmbed from "react-lite-youtube-embed";

import type {
  Config,
  Genre,
  SearchResult,
  AllDetails,
  MediaType,
  Credit,
} from "../types";
import { DisplayError } from "./display-error";
import { SimplePosterImage } from "./poster-image";
import useIntersectionObserver from "./use-intersection-observer-hook";
import styles from "./all-information.module.css";
import { font } from "./font";
import { fetcher } from "./utils";

export function AllInformation({
  result,
  genres,
  config,
  mediaType,
  loadOnIntersection,
}: {
  result: SearchResult;
  genres: Genre;
  config: Config;
  mediaType: "movie" | "tv" | "person";
  loadOnIntersection: boolean;
}) {
  const [load, setLoad] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});

  const isVisible = !!entry?.isIntersecting;
  if (loadOnIntersection && isVisible && !load) {
    setLoad(true);
  }

  const { data, error, isLoading } = useSWR<AllDetails, Error>(
    load
      ? `/api/themoviedb/alldetails?${new URLSearchParams({
          mediaType,
          id: `${result.id}`,
        })}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
      // Treat it as immutable
      // https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
      revalidateOnFocus: process.env.NODE_ENV === "development",
      revalidateIfStale: process.env.NODE_ENV === "development",
      revalidateOnReconnect: process.env.NODE_ENV === "development",
    }
  );

  // if (data) {
  //   console.log(data);
  // }

  return (
    <div ref={ref}>
      {data && (
        <DisplayAllData data={data} config={config} mediaType={mediaType} />
      )}
      {error && (
        <DisplayError
          error={error}
          title="Unable to load all details"
          closeError={() => {
            window.location.reload();
          }}
        />
      )}
      {!data && !error && (
        <button
          className="secondary"
          onClick={() => {
            setLoad(true || isLoading);
          }}
          aria-busy={load ? "true" : "false"}
        >
          {load ? "Loading more information" : "Load more information"}
        </button>
      )}
    </div>
  );
}

function DisplayAllData({
  data,
  config,
  mediaType,
}: {
  data: AllDetails;
  config: Config;
  mediaType: MediaType;
}) {
  const [cappedCast, setCappedCast] = useState(4);
  const [cappedVideos, setCappedVideos] = useState(2);

  const youTubeVideos =
    data.videos && data.videos.results
      ? data.videos.results.filter((v) => v.site === "YouTube" && v.key)
      : [];

  const recommendations = data.recommendations
    ? data.recommendations.results
    : [];

  const credits: Credit[] = [];
  let creditType: MediaType = mediaType;

  if (data.credits && data.credits.cast) {
    credits.push(...data.credits.cast);
    creditType = "person";
  } else if (data.movie_credits && data.movie_credits.cast) {
    credits.push(...data.movie_credits.cast);
    creditType = "movie";
  } else if (data.tv_credits && data.tv_credits.cast) {
    credits.push(...data.tv_credits.cast);
    creditType = "tv";
  }

  return (
    <div>
      {credits.length > 0 && (
        <div className={styles.list_data}>
          <h3 className={font.className}>Cast</h3>
          <div
            className={
              Math.min(credits.length, cappedCast) <= 4 ? "grid" : undefined
            }
          >
            {credits.slice(0, cappedCast).map((cast) => {
              return (
                <div key={cast.id}>
                  <Link href={`/share/${creditType}/${cast.id}`}>
                    {(cast.profile_path ||
                      cast.backdrop_path ||
                      cast.poster_path) && (
                      <SimplePosterImage
                        profile_path={cast.profile_path}
                        backdrop_path={cast.backdrop_path}
                        poster_path={cast.poster_path}
                        alt={cast.name}
                        config={config}
                      />
                    )}
                    <b>{cast.title || cast.name}</b>
                  </Link>
                </div>
              );
            })}
            {credits.length > cappedCast && (
              <button
                className="secondary"
                onClick={() => {
                  setCappedCast((p) => p + 10);
                }}
              >
                Load more cast
              </button>
            )}
          </div>
        </div>
      )}

      {youTubeVideos.length > 0 && (
        <div className={styles.list_data}>
          <h3 className={font.className}>Videos</h3>
          <div
            className={
              Math.min(youTubeVideos.length, cappedVideos) <= 2
                ? "grid"
                : undefined
            }
          >
            {youTubeVideos.slice(0, cappedVideos).map((video) => {
              return (
                <div key={video.id}>
                  {video.name} {video.official && <i>official</i>}
                  <LiteYouTubeEmbed
                    id={video.key}
                    title={`${video.official ? "official " : ""}${
                      video.type ? `${video.type} ` : ""
                    } (${video.published_at})`}
                  />
                </div>
              );
            })}
            {youTubeVideos.length > cappedVideos && (
              <button
                className="secondary"
                onClick={() => {
                  setCappedVideos((p) => p + 2);
                }}
              >
                Load more videos
              </button>
            )}
          </div>
        </div>
      )}

      <ResultSublist
        results={recommendations}
        title="Recommendations"
        config={config}
        defaultCapped={4}
      />

      {data.homepage && (
        <p>
          <a href={data.homepage} target="_blank" rel="noreferrer">
            Homepage (<small>{new URL(data.homepage).hostname}</small>)
          </a>
        </p>
      )}
      {data.imdb_id && (
        <p>
          <a
            href={`https://www.imdb.com/${
              mediaType === "person" ? "name" : "title"
            }/${data.imdb_id}/`}
            target="_blank"
            rel="noreferrer"
          >
            <Image src="/imdb-logo.png" width={50} height={50} alt="Logo" />
          </a>
        </p>
      )}
    </div>
  );
}

function ResultSublist({
  results,
  title,
  defaultCapped,
  config,
}: {
  results: SearchResult[];
  defaultCapped: number;
  config: Config;
  title: string;
}) {
  const [capped, setCapped] = useState(defaultCapped);
  if (!results.length) return null;

  return (
    <div className={styles.list_data}>
      <h3 className={font.className}>Recommendations</h3>
      <div
        className={Math.min(results.length, capped) <= 4 ? "grid" : undefined}
      >
        {results.slice(0, capped).map((result) => {
          const url = `/share/${result.media_type}/${result.id}`;
          return (
            <div key={result.id}>
              <Link href={url}>
                {result.poster_path ? (
                  <SimplePosterImage
                    poster_path={result.poster_path}
                    alt={result.title || result.name}
                    config={config}
                  />
                ) : result.backdrop_path ? (
                  <SimplePosterImage
                    backdrop_path={result.backdrop_path}
                    alt={result.title || result.name}
                    config={config}
                  />
                ) : (
                  result.title || result.name
                )}
              </Link>

              <Link href={url}>
                <b>{result.title || result.name}</b>
              </Link>
            </div>
          );
        })}
        {results.length > capped && (
          <button
            className="secondary"
            onClick={() => {
              setCapped((p) => p + 5);
            }}
          >
            Load more {title.toLowerCase()}
          </button>
        )}
      </div>
    </div>
  );
}
