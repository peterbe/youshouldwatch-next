import useSWR from "swr";
import axios from "axios";

export type Config = {};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useConfig() {
  const { data, error, isLoading } = useSWR<Config>(`/api/config`, fetcher);

  return {
    config: data,
    isLoading,
    isError: error,
  };
}
