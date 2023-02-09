import { useContext } from "react";

import { FirebaseContext } from "../app/firebase-provider";
import type { MediaType, SearchResult } from "../types";
import { triggerParty } from "./party";

export function ToggleToList({
  result,
  isArchive,
  mediaType,
}: {
  result: SearchResult;
  isArchive?: boolean;
  mediaType: MediaType;
}) {
  const { list, user, addToList, removeFromList } = useContext(FirebaseContext);
  const onListAlready = new Set(list.map((r) => r.result.id)).has(result.id);

  let text = "";
  if (onListAlready && user) {
    text = "Check off";
  } else if (onListAlready) {
    text = "Remove from my list";
  } else if (isArchive) {
    text = "Add back to my list";
  } else {
    text = "Add to my list";
  }
  return (
    <button
      data-testid="display-toggle"
      onClick={(event) => {
        const copy = Object.assign({}, result);
        if (!copy.media_type) {
          copy.media_type = mediaType;
        }
        if (onListAlready) {
          removeFromList(copy).then(() => {
            triggerParty(event.target as HTMLElement, "sparkles");
          });
        } else {
          addToList(copy).then(() => {
            triggerParty(event.target as HTMLElement);
          });
        }
      }}
    >
      {text}
    </button>
  );
}
