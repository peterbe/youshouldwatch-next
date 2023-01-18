import party from "party-js";

export function triggerParty(element: HTMLElement) {
  party.confetti(element, {
    count: 60,
    spread: party.variation.range(40, 50),
    speed: party.variation.range(500, 600),
  });
}
