import Image from "next/image";
export function DisplayMediaTypeIcon({ mediaType }: { mediaType: string }) {
  if (mediaType === "movie") {
    return <Image src="/movie.png" alt="Movie icon" width={50} height={50} />;
  }
  if (mediaType === "tv") {
    return <Image src="/tv.png" alt="TV icon" width={50} height={50} />;
  }

  if (mediaType === "person") {
    return <Image src="/actor.png" alt="Person" width={50} height={50} />;
  }

  return null;
}
