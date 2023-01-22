import copy from "copy-to-clipboard";

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

  function getURL() {
    return `${window.location.origin}/share/${result.media_type}/${result.id}`;
  }

  function getTextareaText() {
    let textareaText = `You should watch: ${result.title || result.name}`;
    textareaText += `\n${getURL()}`;
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
              <a href={getURL()}>{getURL()}</a>
            </p>
            <textarea rows={2} value={getTextareaText()} readOnly></textarea>
            <p>
              <button
                onClick={() => {
                  if (copy(getTextareaText())) {
                    setCopied(true);
                  }
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
              text: `You should watch: ${result.title || result.name}`,
              url: getURL(),
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
