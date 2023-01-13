"use client";
import Link from "next/link";
import { useContext } from "react";
import { FirebaseContext } from "./firebase-provider";
export function Nav() {
  const { list } = useContext(FirebaseContext);
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">
            <strong>Home</strong>{" "}
            {list && list.length > 0 && <span>({list.length})</span>}
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link href="/add" role="button" data-testid="nav-add">
            + Add/Find
          </Link>
        </li>
        <li>
          <a href="#" role="button">
            Button
          </a>
        </li>
      </ul>
    </nav>
  );
}
