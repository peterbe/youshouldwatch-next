import DefaultTags from "./default-tags";
import { BASE_URL } from "@/lib/constants";

export default function Head() {
  return (
    <>
      <title>You Should Watch</title>
      <meta property="og:title" content="You should watch" />
      <meta property="og:image" content="/favicon-512x512.png" />
      <meta property="og:url" content={BASE_URL} />
      <meta property="og:type" content="website" />
      <DefaultTags />
    </>
  );
}
