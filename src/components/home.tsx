"use client";
import { useContext } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { font } from "./font";
import { FirebaseContext } from "../app/firebase-provider";
import { DisplayResult } from "./display-search-result";
import type { StoredSearchResult, Config, Genre } from "../types";

type Props = {
  config: Config;
  genres: Genre;
};

export function Home({ config, genres }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user, list, listArchive, isLoading } = useContext(FirebaseContext);

  const showListArchive = searchParams.get("show") === "archive";

  let toggleShowArchiveURL = pathname || ".";
  if (!showListArchive) {
    toggleShowArchiveURL += "?show=archive";
  }
  toggleShowArchiveURL += "#list";

  const showList = showListArchive ? listArchive : list;

  return (
    <div>
      {showList.length === 0 && (
        <h1 className={font.className}>You Should Watch</h1>
      )}

      {isLoading && <Loading />}

      {!isLoading && !user && list && list.length > 1 && <AnonymousWarning />}

      {showList.length === 0 && !isLoading && (
        <Empty archiveCount={listArchive.length} />
      )}

      {listArchive.length > 0 && showListArchive && (
        <Link href={toggleShowArchiveURL} role="button" className="secondary">
          Close previously checked off ({listArchive.length})
        </Link>
      )}

      {showList.length > 0 && (
        <ShowList
          results={showList}
          config={config}
          genres={genres}
          isArchive={showListArchive}
        />
      )}

      {listArchive.length > 0 && !showListArchive && (
        <Link
          href={toggleShowArchiveURL}
          role="button"
          className="secondary"
          data-testid="close-checked-off"
        >
          Show previously checked off ({listArchive.length})
        </Link>
      )}

      {!user && !showList.length && <HowItWorks />}
    </div>
  );
}

function ShowList({
  results,
  config,
  genres,
  isArchive,
}: {
  results: StoredSearchResult[];
  config: Config;
  genres: Genre;
  isArchive: boolean;
}) {
  return (
    <div>
      <h1 id="list" className={font.className}>
        {isArchive ? "Your Checked Off List" : "Your Watch List"}
      </h1>

      {results.map((result, i) => (
        <DisplayResult
          key={result.id}
          index={i}
          config={config}
          result={result.result}
          added={result.added}
          isArchive={isArchive}
          genres={genres}
          loadOnIntersection={false}
        />
      ))}
    </div>
  );
}

function Loading() {
  return (
    <article>
      <p aria-busy="true">Hang on...</p>
    </article>
  );
}

function Empty({ archiveCount }: { archiveCount: number }) {
  return (
    <article>
      <p>
        <i>You currently have no movies or TV shows on your list</i>
      </p>
      {archiveCount > 0 && (
        <p>
          You have <b>{archiveCount}</b> previously checked off movies or TV
          shows
        </p>
      )}
    </article>
  );
}

function AnonymousWarning() {
  return (
    <article>
      <p>
        <b>Watch out!</b>
      </p>
      <p>
        You have a list but it&apos;s only saved here on this device.{" "}
        <Link href="/signin" role="button">
          Sign up/in (free) to not lose it
        </Link>
      </p>
    </article>
  );
}

function HowItWorks() {
  return (
    <article>
      <h2 className={font.className}>How It Works</h2>

      <ol>
        <li>
          <h4 className={font.className}>
            You search for movies and TV shows you should watch
          </h4>
        </li>
        <li>
          <h4 className={font.className}>
            Add them to your list (<Link href="/signin">Sign in</Link> with
            Google to not lose them)
          </h4>
        </li>
        <li>
          <h4 className={font.className}>You watch them</h4>
        </li>
        <li>
          <h4 className={font.className}>Come back here, check it off</h4>
        </li>
      </ol>
    </article>
  );
}
