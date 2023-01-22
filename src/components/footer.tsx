"use client";
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
    </footer>
  );
}
