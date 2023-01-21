// import { useState, useEffect, MutableRefObject, RefObject } from "react";

// export function useOnScreen<T extends Element>(
//   ref: MutableRefObject<T | undefined> | RefObject<T>,
//   options?: IntersectionObserverInit
// ): boolean {
//   const [isIntersecting, setIntersecting] = useState(false);
//   useEffect(() => {
//     let isMounted = true;
//     const observer = new IntersectionObserver(([entry]) => {
//       isMounted && setIntersecting(entry.isIntersecting);
//     }, options);

//     if (ref.current) {
//       observer.observe(ref.current);
//     }

//     return () => {
//       isMounted = false;
//       ref.current && observer.unobserve(ref.current);
//     };
//   }, [Object.values(options || {}).join(",")]);
//   return isIntersecting;
// }

import { RefObject, useEffect, useState } from "react";

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = "0%",
    freezeOnceVisible = false,
  }: Args
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const node = elementRef?.current; // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    elementRef?.current,
    JSON.stringify(threshold),
    root,
    rootMargin,
    frozen,
  ]);

  return entry;
}

export default useIntersectionObserver;
