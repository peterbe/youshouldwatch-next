// import { useContext } from "react";

import copy from "copy-to-clipboard";

// import { FirebaseContext } from "../app/firebase-provider";
import { text } from "node:stream/consumers";
import { useEffect, useState } from "react";
import type { SearchResult } from "../types";
import { triggerParty } from "./party";

function canShare() {
  try {
    const share = !!navigator.share;
    const canShare = !!navigator.canShare;
    return share && canShare;
  } catch {
    return false;
  }
}
export function WebShare({ result }: { result: SearchResult }) {
  const [displayModal, setDisplayModal] = useState(false);
  // const [shareError, setShareError] = useState<Error | null>(null);
  const [shared, setShared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedOnce, setCopiedOnce] = useState(false);
  //   const { list, addToList, removeFromList } = useContext(FirebaseContext);
  //   const onListAlready = new Set(list.map((r) => r.result.id)).has(result.id);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted) {
        setShared(false);
      }
    }, 3000);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [shared]);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted) {
        setCopied(false);
      }
    }, 2000);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [copied]);

  useEffect(() => {
    if (copied) {
      setCopiedOnce(true);
    }
  }, [copied]);

  function getTextareaText() {
    let textareaText = `You should watch: ${result.title || result.name}`;
    textareaText += `\n${window.location.href}`;
    return textareaText;
  }

  function getPasteCommand() {
    const firstWord = navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl";
    return (
      <>
        <kbd>{firstWord}</kbd>-<kbd>V</kbd>
      </>
    );
  }

  return (
    <>
      {displayModal && (
        <dialog open>
          <article>
            <header>
              <a
                href="#close"
                aria-label="Close"
                className="close"
                onClick={(event) => {
                  event.preventDefault();
                  setDisplayModal(false);
                  setCopiedOnce(false);
                }}
              ></a>
              Share!
            </header>

            <p>
              <a href={window.location.href}>{window.location.href}</a>
            </p>
            <textarea rows={2} value={getTextareaText()} readOnly></textarea>
            <p>
              <button
                onClick={() => {
                  const x = copy(getTextareaText());
                  console.log("X:", x);

                  setCopied(true);
                }}
              >
                {copied ? "Copied!" : "Copy link to clipboard"}
              </button>
            </p>
            <p>
              <button
                className={!copiedOnce ? "secondary outline" : undefined}
                onClick={() => {
                  setDisplayModal(false);
                  setCopiedOnce(false);
                }}
              >
                Close
              </button>
              {copiedOnce && (
                <small>
                  Now go paste ({getPasteCommand()}) this somewhere else.
                </small>
              )}
            </p>
          </article>
        </dialog>
      )}

      <button
        data-testid="display-web-share"
        onClick={(event) => {
          console.log("Hello");
          if (canShare()) {
            const shareData = {
              title: result.title || result.name,
              text: "I found something I think You Should Watch",
              url: window.location.href,
            };
            navigator
              .share(shareData)
              .then(() => {
                setShared(true);
                triggerParty(event.target as HTMLElement);
              })
              .catch((err) => {
                console.warn("Share error", err);
                // setShareError(err);
              });
          } else {
            setDisplayModal(true);
          }
        }}
      >
        {shared ? "Shared 🥰😘😻!" : "Share with friends"}
      </button>
    </>
  );
}
