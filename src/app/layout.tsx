import "@picocss/pico/css/pico.min.css";

import FirebaseProvider from "./firebase-provider";
import { Nav } from "../components/nav";
import "./globals.css";
import { PossibleFirebaseError } from "../components/firebase-error";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html data-theme="light">
    <html lang="en">
      <head />
      <body>
        <FirebaseProvider>
          <main className="container">
            <Nav />

            {children}

            <PossibleFirebaseError />
          </main>
        </FirebaseProvider>
      </body>
    </html>
  );
}
