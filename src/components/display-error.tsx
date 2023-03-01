import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "./display-error.module.css";

export function DisplayError({
  error,
  title,
  closeError,
}: {
  error: Error;
  title?: string;
  closeError: () => void;
}) {
  const [displayFullError, setDisplayFullError] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  let reloadURL = pathname;
  if (searchParams && searchParams.toString()) {
    reloadURL += `?${searchParams}`;
  }

  return (
    <dialog open>
      <article className={styles.error}>
        <header>
          <a
            href="#close"
            aria-label="Close"
            className="close"
            onClick={(event) => {
              event.preventDefault();
              closeError();
            }}
          ></a>
          {title ? title : "Error"}
        </header>
        <p>{error.message}</p>

        {displayFullError && <pre>{error.toString()}</pre>}

        <p>
          <button
            className="secondary outline"
            onClick={() => {
              setDisplayFullError((p) => !p);
            }}
          >
            {displayFullError ? "Close" : "Display full error"}
          </button>
        </p>

        {reloadURL && (
          <footer>
            <a
              href={reloadURL}
              onClick={() => {
                window.location.reload();
              }}
              role="button"
            >
              Reload
            </a>
          </footer>
        )}
      </article>
    </dialog>
  );
}
