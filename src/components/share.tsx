// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { useConfig, useMovie, useTVShow } from "../app/hooks";

// const queryClient = new QueryClient();

import { font } from "./font";

type MediaType = "movie" | "tv";

// type Props = {
//   type: string;
//   id: string;
// };
// export function Share({ type, id }: Props) {
export function Share() {
  return (
    <div>
      <h1 className={font.className}>SHARE LOADING</h1>
    </div>
  );
  // const {
  //   status: configStatus,
  //   data: config,
  //   error: configError,
  //   isFetching,
  //   isLoading: isLoadingConfig,
  // } = useConfig();
  // let isReady = configStatus === "success";

  //   if (!(params.type === "movie" || params.type === "tv")) {
  //     return (
  //       <div>
  //         <h1>Page not found</h1>
  //         <h2>Invalid page</h2>
  //       </div>
  //     );
  //   }
  //   const mediaType = params.type;

  //   const id = parseInt(params.id);
  //   const isInt = Number.isInteger(id) && id > 0;

  //   if (!isInt) {
  //     return (
  //       <div>
  //         <h1>Page not found</h1>
  //         <h2>Invalid ID</h2>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div>
  //       <QueryClientProvider client={queryClient}>
  //         <Inner mediaType={mediaType} id={id} />
  //       </QueryClientProvider>
  //     </div>
  //   );
}

// function isInt(x: string) {
//   return Number.isInteger(x);
// }

// function Inner({ mediaType, id }: { mediaType: MediaType; id: number }) {
//   const {
//     status: configStatus,
//     data: config,
//     error: configError,
//     isFetching,
//     isLoading: isLoadingConfig,
//   } = useConfig();
//   let isReady = configStatus === "success";

//   const {
//     status: movieStatus,
//     data: movieData,
//     error: movieError,
//     // isFetching,
//     // isLoading: isLoadingConfig,
//   } = useMovie(isReady && mediaType === "movie", id);
//   // console.log("MOVIE", movieData);
//   // if (movieData) {
//   //   console.log(JSON.stringify(movieData, undefined, 2));
//   // }
//   const {
//     status: tvStatus,
//     data: tvData,
//     error: tvError,
//     // isFetching,
//     // isLoading: isLoadingConfig,
//   } = useTVShow(isReady && mediaType === "tv", id);

//   const hasDetails = isReady && (movieData || tvData);

//   return (
//     <div>
//       <h1 className={font.className}>
//         {!hasDetails && "Loading..."}
//         {hasDetails && movieData && movieData.title}
//         {hasDetails && tvData && tvData.title}
//       </h1>
//     </div>
//   );
// }
