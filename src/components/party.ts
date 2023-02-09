import party from "party-js";

export function triggerParty(
  element: HTMLElement,
  type: "confetti" | "sparkles" = "confetti"
) {
  const func = type === "sparkles" ? party.sparkles : party.confetti;
  func(element, {
    count: 60,
    spread: party.variation.range(40, 50),
    speed: party.variation.range(500, 600),
  });
}
