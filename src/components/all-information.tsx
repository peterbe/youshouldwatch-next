import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import LiteYouTubeEmbed from "react-lite-youtube-embed";

import type { Config, Genre, SearchResult, AllDetails } from "../types";
import { DisplayError } from "./display-error";
import { SimplePosterImage } from "./poster-image";
import useIntersectionObserver from "./use-intersection-observer-hook";
import styles from "./all-information.module.css";
import { font } from "./font";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

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
  mediaType: "movie" | "tv";
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
      {data && <DisplayAllData data={data} config={config} />}
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
}: {
  data: AllDetails;
  config: Config;
}) {
  const [cappedCast, setCappedCast] = useState(4);
  const [cappedVideos, setCappedVideos] = useState(2);
  const [cappedRecommendations, setCappedRecommendations] = useState(4);

  const youTubeVideos =
    data.videos && data.videos.results
      ? data.videos.results.filter((v) => v.site === "YouTube" && v.key)
      : [];

  return (
    <div>
      {data.credits && data.credits.cast && data.credits.cast.length > 0 && (
        <div className={styles.list_data}>
          <h3 className={font.className}>Cast</h3>
          <div
            className={
              Math.min(data.credits.cast.length, cappedCast) <= 4
                ? "grid"
                : undefined
            }
          >
            {data.credits.cast.slice(0, cappedCast).map((cast) => {
              return (
                <div key={cast.id}>
                  {cast.profile_path && (
                    <SimplePosterImage
                      profile_path={cast.profile_path}
                      alt={cast.name}
                      config={config}
                    />
                  )}
                  <b>{cast.name}</b>
                </div>
              );
            })}
            {data.credits.cast.length > cappedCast && (
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

      {data.recommendations &&
        data.recommendations &&
        data.recommendations.results.length > 0 && (
          <div className={styles.list_data}>
            <h3 className={font.className}>Recommendations</h3>
            <div
              className={
                Math.min(
                  data.recommendations.results.length,
                  cappedRecommendations
                ) <= 4
                  ? "grid"
                  : undefined
              }
            >
              {data.recommendations.results
                .slice(0, cappedRecommendations)
                .map((rec) => {
                  const url = `/share/${rec.media_type}/${rec.id}`;
                  return (
                    <div key={rec.id}>
                      <Link href={url}>
                        {rec.poster_path ? (
                          <SimplePosterImage
                            poster_path={rec.poster_path}
                            alt={rec.title || rec.name}
                            config={config}
                          />
                        ) : rec.backdrop_path ? (
                          <SimplePosterImage
                            backdrop_path={rec.backdrop_path}
                            alt={rec.title || rec.name}
                            config={config}
                          />
                        ) : (
                          rec.title || rec.name
                        )}
                      </Link>

                      <Link href={url}>
                        <b>{rec.title || rec.name}</b>
                      </Link>
                    </div>
                  );
                })}
              {data.recommendations.results.length > cappedCast && (
                <button
                  className="secondary"
                  onClick={() => {
                    setCappedRecommendations((p) => p + 5);
                  }}
                >
                  Load more recommendations
                </button>
              )}
            </div>
          </div>
        )}

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
            href={`https://www.imdb.com/title/${data.imdb_id}/`}
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
