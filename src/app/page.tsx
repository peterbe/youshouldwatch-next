import { Home } from "../components/home";
import { getConfig, getGenres, getLanguages } from "../lib/themoviedb";

export default async function Page() {
  const [config, genres, languages] = await Promise.all([
    getConfig(),
    getGenres(),
    getLanguages(),
  ]);
  return <Home config={config} genres={genres} languages={languages} />;
}
