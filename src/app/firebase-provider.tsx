"use client";

import { createContext, useState } from "react";
import { SearchResult } from "../types";

type Interface = {
  list: SearchResult[];
  addToList: (x: SearchResult) => void;
  removeFromList: (x: SearchResult) => void;
};
export const FirebaseContext = createContext<Interface>({
  list: [],
  addToList: () => {},
  removeFromList: () => {},
});

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [list, setList] = useState<SearchResult[]>([]);
  const firebase: Interface = {
    list,
    addToList: (result: SearchResult) => {
      setList((prevState) => [
        result,
        ...prevState.filter((x) => x.id != result.id),
      ]);
    },
    removeFromList: (result: SearchResult) => {
      setList((prevState) => prevState.filter((x) => x.id != result.id));
    },
  };
  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}
