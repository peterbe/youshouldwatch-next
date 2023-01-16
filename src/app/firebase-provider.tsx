"use client";
import { createContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import type { Firestore, Unsubscribe } from "firebase/firestore";
import {
  getFirestore,
  onSnapshot,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  collection,
  addDoc,
  query,
  where,
  doc,
  deleteDoc,
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
  authDomain: "youshouldwatch-77a46.firebaseapp.com",
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
  addToList: (x: SearchResult) => Promise<void>;
  removeFromList: (x: SearchResult) => Promise<void>;
  isLoading: boolean;
};
export const FirebaseContext = createContext<Interface>({
  user: null,
  auth: null,
  signOut: async () => {},
  list: [],
  addToList: async () => {},
  removeFromList: async () => {},
  isLoading: true,
});

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<Error | null>(null);
  const [list, setList] = useState<StoredSearchResult[]>([]);
  const [temporaryList, setTemporaryList] = useState<StoredSearchResult[]>([]);
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
    // console.log("AUTO CREATED!", auth);
    if (auth) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);

          // if (temporaryList.length) {
          //   console.log("NEED TO MOVE OVER...", temporaryList);
          // }
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          // const uid = user.uid;
          // ...
        } else {
          // User is signed out
          // ...
          setUser(false);
        }
      });
    }
  }, [auth]);
  useEffect(() => {
    if (user && user.email) {
      rememberLastLogin(user.email);
    }
  }, [user]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    if (db && user) {
      // Create a listener
      const q = query(collection(db, "list"), where("uid", "==", user.uid));

      unsubscribe = onSnapshot(q, (snapshot) => {
        const results: StoredSearchResult[] = [];
        snapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const data = doc.data();
          results.push({
            id: doc.id,
            added: data.added.toDate(),
            uid: data.uid,
            result: data.result,
          });
        });
        setList(results);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, user]);

  const listIds = list.map((x) => x.result.id);
  const combinedList = [
    ...list,
    ...temporaryList.filter((x) => !listIds.includes(x.result.id)),
  ];

  const firebase: Interface = {
    user,
    auth,
    signOut: async () => {
      if (auth) await signOut(auth);
      else alert("Couldn't sign out");
    },
    list: combinedList,
    addToList: async (result: SearchResult) => {
      if (user && db) {
        const docRef = await addDoc(collection(db, "list"), {
          uid: user.uid,
          added: new Date(),
          result,
        });
      } else {
        // setList((prevState) => [
        //   result,
        //   ...prevState.filter((x) => x.id != result.id),
        // ]);
        // XXX Move this to the top of the function??
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

      // if (!user && auth) {
      //   // Force an anonymous sign in
      //   try {
      //     await signInAnonymously(auth);
      //   } catch (err) {
      //     if (err instanceof Error) {
      //       setError(err);
      //     } else {
      //       throw err;
      //     }
      //   }
      // }
    },
    removeFromList: async (result: SearchResult) => {
      // setList((prevState) => prevState.filter((x) => x.id != result.id));
      setTemporaryList((prevState) =>
        prevState.filter((x) => x.result.id !== result.id)
      );
      const found = list.find((x) => x.result.id === result.id);
      if (db && found && found.id) {
        deleteDoc(doc(db, "list", found.id))
          .then(() => {
            // deleted
          })
          .catch((err) => {
            if (err instanceof Error) {
              setError(err);
            } else {
              throw err;
            }
          });
      }

      setUndoDelete(result);
    },
    isLoading: !db || user === null,
  };

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}
