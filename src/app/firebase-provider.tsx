"use client";
import { createContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { Firestore, Unsubscribe } from "firebase/firestore";
import {
  getFirestore,
  onSnapshot,
  connectFirestoreEmulator,
  writeBatch,
} from "firebase/firestore";
import {
  collection,
  addDoc,
  query,
  where,
  doc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import type { Auth, User } from "firebase/auth";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  connectAuthEmulator,
} from "firebase/auth";

import type { SearchResult, StoredSearchResult } from "../types";
import { rememberLastLogin } from "../components/utils";
import { useTemporaryList } from "./use-temporary-list";

const EMULATE_FIREBASE = Boolean(
  JSON.parse(process.env.NEXT_PUBLIC_EMULATE_FIREBASE || "false")
);
if (EMULATE_FIREBASE) {
  console.warn("Running Firebase in emulator mode");
}
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwvbuDEJUGvOsIzRwT7rp27hG8A_dUqLc",
  // authDomain: "youshouldwatch-77a46.firebaseapp.com",
  authDomain: "ushdwat.ch",
  projectId: "youshouldwatch-77a46",
  storageBucket: "youshouldwatch-77a46.appspot.com",
  messagingSenderId: "747469617089",
  appId: "1:747469617089:web:217c5a16ab400106b72140",
};

type Interface = {
  user: User | false | null;
  auth: Auth | null;
  signOut: () => Promise<void>;
  list: StoredSearchResult[];
  listArchive: StoredSearchResult[];
  addToList: (x: SearchResult) => Promise<void>;
  removeFromList: (x: SearchResult) => Promise<void>;
  checkOffFromList: (x: SearchResult) => Promise<void>;
  isLoading: boolean;
  firebaseError: Error | null;
  resetFirebaseError: () => void;
};
export const FirebaseContext = createContext<Interface>({
  user: null,
  auth: null,
  signOut: async () => {},
  list: [],
  listArchive: [],
  addToList: async () => {},
  removeFromList: async () => {},
  checkOffFromList: async () => {},
  isLoading: true,
  firebaseError: null,
  resetFirebaseError: async () => {},
});

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<Error | null>(null);
  const [list, setList] = useState<StoredSearchResult[]>([]);
  const [listArchive, setListArchive] = useState<StoredSearchResult[]>([]);
  const { temporaryList, setTemporaryList, clearTemporaryList } =
    useTemporaryList();

  const [undoDelete, setUndoDelete] = useState<SearchResult | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    if (EMULATE_FIREBASE) {
      connectFirestoreEmulator(db, "localhost", 8080);
    }
    setDb(db);

    const auth = getAuth(app);
    if (EMULATE_FIREBASE) {
      connectAuthEmulator(auth, "http://localhost:9099");
    }
    setAuth(auth);
  }, []);

  const [user, setUser] = useState<User | false | null>(null);
  useEffect(() => {
    if (auth) {
      onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            setUser(user);
          } else {
            // User is signed out (or has never signed in yet)
            setUser(false);
          }
        },
        (err) => {
          if (err instanceof Error) {
            setError(err);
          } else {
            throw err;
          }
        }
      );
    }
  }, [auth]);
  useEffect(() => {
    if (user && user.email) {
      rememberLastLogin(user.email);
    }
  }, [user]);

  const [excessDuplicateDocIds, setExcessDuplicateDocIds] = useState<string[]>(
    []
  );
  useEffect(() => {
    if (excessDuplicateDocIds.length > 0 && db) {
      for (const id of excessDuplicateDocIds) {
        deleteDoc(doc(db, "list", id)).then(() => {
          console.log(`Deleted duplicate 'list' ID ${id}`);
        });
      }
    }
  }, [excessDuplicateDocIds, db]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    if (db && user) {
      const q = query(
        collection(db, "list"),
        where("uid", "==", user.uid),
        orderBy("added", "desc")
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const results: StoredSearchResult[] = [];
          const uniqueResultIds = new Set();
          const duplicateDocIds: string[] = [];
          snapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const data = doc.data();
            // Second layer protection in case you get duplicates in Firebase
            if (uniqueResultIds.has(data.result.id)) {
              duplicateDocIds.push(doc.id);
              return;
            }
            results.push({
              id: doc.id,
              added: data.added.toDate(),
              uid: data.uid,
              result: data.result,
            });
            uniqueResultIds.add(data.result.id);
          });
          setList(results);
          if (duplicateDocIds.length > 0) {
            setExcessDuplicateDocIds(duplicateDocIds);
          }
        },
        (err) => {
          if (err instanceof Error) {
            setError(err);
          } else {
            throw err;
          }
        }
      );
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, user]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    if (db && user) {
      const q = query(
        collection(db, "listarchive"),
        where("uid", "==", user.uid),
        orderBy("added", "desc")
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const results: StoredSearchResult[] = [];
          const uniqueResultIds = new Set();
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (uniqueResultIds.has(data.result.id)) return;
            results.push({
              id: doc.id,
              added: data.added.toDate(),
              uid: data.uid,
              result: data.result,
            });
            uniqueResultIds.add(data.result.id);
          });
          setListArchive(results);
        },
        (err) => {
          if (err instanceof Error) {
            setError(err);
          } else {
            throw err;
          }
        }
      );
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, user]);

  useEffect(() => {
    if (user && db && temporaryList.length > 0) {
      const batch = writeBatch(db);
      const coll = collection(db, "list");
      for (const each of temporaryList) {
        const newRef = doc(coll);
        batch.set(newRef, {
          uid: user.uid,
          added: new Date(each.added),
          result: each.result,
        });
      }
      batch
        .commit()
        .then(() => {
          clearTemporaryList();
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [user, db, temporaryList]);

  const listIds = list.map((x) => x.result.id);
  const remaining = temporaryList.filter((x) => !listIds.includes(x.result.id));
  const combinedList = [...list, ...remaining];

  const firebase: Interface = {
    user,
    auth,
    signOut: async () => {
      if (auth) await signOut(auth);
      else alert("Couldn't sign out");
    },
    list: combinedList,
    listArchive,
    addToList: async (result: SearchResult) => {
      if (!result.media_type) throw new Error("no media type!");
      if (user && db) {
        try {
          addDoc(collection(db, "list"), {
            uid: user.uid,
            added: new Date(),
            result,
          })
            .then(() => {})
            .catch((err) => {
              if (err instanceof Error) {
                setError(err);
              } else {
                throw err;
              }
            });
        } catch (err) {
          if (err instanceof Error) {
            setError(err);
          } else {
            throw err;
          }
        }
      } else {
        setTemporaryList((prevState) => [
          {
            result,
            id: `${Math.random()}`,
            uid: "",
            added: new Date(),
          },
          ...prevState.filter((x) => x.result.id != result.id),
        ]);
      }
    },
    removeFromList: async (result: SearchResult) => {
      setTemporaryList((prevState) =>
        prevState.filter((x) => x.result.id !== result.id)
      );
      const found = list.find((x) => x.result.id === result.id);
      if (db && found && found.id && user) {
        deleteDoc(doc(db, "list", found.id))
          .then(() => {
            // deleted
            setUndoDelete(result);

            addDoc(collection(db, "listarchive"), {
              uid: user.uid,
              added: new Date(),
              result,
            }).catch((err) => {
              if (err instanceof Error) {
                setError(err);
              } else {
                throw err;
              }
            });
          })
          .catch((err) => {
            if (err instanceof Error) {
              setError(err);
            } else {
              throw err;
            }
          });
      } else {
        setUndoDelete(result);
      }
    },
    checkOffFromList: async (result: SearchResult) => {
      // const found = list.find((x) => x.result.id === result.id);
      // if (db && found && found.id) {
      //   updateDoc(doc(db, "list", found.id), {
      //     watched: new Date(),
      //   });
      // }
    },
    isLoading: !db || user === null,
    firebaseError: error,
    resetFirebaseError: () => {
      setError(null);
    },
  };

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}
