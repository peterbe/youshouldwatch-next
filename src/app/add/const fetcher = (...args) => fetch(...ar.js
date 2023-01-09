const fetcher = (...args) => fetch(...args).then((res) => res.json());
function useConfig() {
  const { data, error, isLoading } = useSWR(`/api/config`, fetcher);

  return {
    user: data,
    isLoading,
    isError: error,
  };
}
