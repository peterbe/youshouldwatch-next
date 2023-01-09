import Link from "next/link";
import "@picocss/pico/css/pico.min.css";

// import "@picocss/pico/scss/pico.scss";
// import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html data-theme="light">
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <main className="container">
          <nav>
            <ul>
              <li>
                <Link href="/">
                  <strong>Home</strong>
                </Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link href="/add" role="button">
                  + Add
                </Link>
              </li>
              <li>
                <a href="#" role="button">
                  Button
                </a>
              </li>
            </ul>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
