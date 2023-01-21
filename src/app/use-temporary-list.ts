import { useEffect, useState } from "react";
import type { StoredSearchResult } from "../types";

const STORAGE_KEY = "temporaryList";

export function useTemporaryList() {
  const [temporaryList, setTemporaryList] = useState<StoredSearchResult[]>([]);

  function clearTemporaryList() {
    setTemporaryList([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Unable to remove storage", err);
    }
  }

  useEffect(() => {
    try {
      const prev = localStorage.getItem(STORAGE_KEY);
      if (prev) {
        setTemporaryList(JSON.parse(prev));
      }
    } catch (err) {
      console.log("Unable to store temporary list in localStorage", err);
    }
  }, []);

  useEffect(() => {
    try {
      if (temporaryList.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(temporaryList));
      }
    } catch (err) {
      console.log("Unable to store temporary list in localStorage", err);
    }
  }, [temporaryList]);

  return { temporaryList, setTemporaryList, clearTemporaryList };
}
