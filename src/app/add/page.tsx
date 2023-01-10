import { Add } from "../../components/add";
import { getConfig, getGenres, getLanguages } from "../../lib/themoviedb";

export default async function Page() {
  const [config, genres, languages] = await Promise.all([
    getConfig(),
    getGenres(),
    getLanguages(),
  ]);

  return <Add config={config} genres={genres} languages={languages} />;
}
