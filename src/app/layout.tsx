import "@picocss/pico/css/pico.min.css";

import FirebaseProvider from "./firebase-provider";
import { Nav } from "../components/nav";
// import './globals.css'

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
          </main>
        </FirebaseProvider>
      </body>
    </html>
  );
}
