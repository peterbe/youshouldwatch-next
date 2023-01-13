import "@picocss/pico/css/pico.min.css";
// import { getConfig } from "../lib/themoviedb";

import FirebaseProvider from "./firebase-provider";
import { Nav } from "./nav";
// import './globals.css'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const config = await getConfig();

  // XXX consider fetching config here and putting it into a context
  // along with languages

  return (
    // <html data-theme="light">
    <html lang="en">
      <head />
      <body>
        <FirebaseProvider>
          <main className="container">
            <Nav />

            {children}
          </main>
        </FirebaseProvider>
      </body>
    </html>
  );
}
