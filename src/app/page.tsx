import { Home } from "../components/home";
import { getConfig, getGenres } from "../lib/themoviedb";

export default async function Page() {
  const [config, genres] = await Promise.all([getConfig(), getGenres()]);
  return <Home config={config} genres={genres} />;
}
