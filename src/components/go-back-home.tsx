import Link from "next/link";

import styles from "./go-back-home.module.css";

export function GoBackHome() {
  return (
    <div className={styles.go_back_home}>
      <p>
        <Link href="/" role="button">
          Go to home page
        </Link>
      </p>
    </div>
  );
}
