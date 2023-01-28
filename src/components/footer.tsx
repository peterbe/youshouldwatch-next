"use client";
import Image from "next/image";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Made with ❤️ by{" "}
        <a
          href="https://www.peterbe.com/about"
          target="_blank"
          rel="noreferrer"
        >
          Peter Bengtsson
        </a>
      </p>

      <p>
        All code is{" "}
        <a
          href="https://github.com/peterbe/youshouldwatch-next"
          target="_blank"
          rel="noreferrer"
        >
          Open Source on GitHub
        </a>
        <br />
      </p>
      <p>
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
          <Image src="/tmdb.svg" width={40} height={40} alt="TMDB" />
        </a>{" "}
        All movies, TV shows, and people comes from{" "}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
          The Movie DB
        </a>
      </p>
    </footer>
  );
}
