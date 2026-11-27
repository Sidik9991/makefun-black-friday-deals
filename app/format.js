// Formatting helpers: money, discount math and verdict labels.
// One job: turn raw deal numbers into the strings the pages show.

export function money(n) {
  return "$" + n.toFixed(2);
}

export function saved(deal) {
  return deal.usual - deal.sale;
}

export function pctOff(deal) {
  return Math.round((1 - deal.sale / deal.usual) * 100);
}

export const VERDICTS = {
  strong: { label: "Strong deal", hint: "A real cut — big discount or big dollars saved." },
  good: { label: "Good deal", hint: "A solid cut on a real product." },
  routine: { label: "Routine", hint: "A small cut, or cheaper somewhere else — check before buying." },
  check: { label: "Check first", hint: "Price not re-verified on the store page today — confirm before buying." },
};

export function verdictLabel(v) {
  return (VERDICTS[v] || VERDICTS.routine).label;
}

export function verdictHint(v) {
  return (VERDICTS[v] || VERDICTS.routine).hint;
}

// Short store badge class, derived from the store name.
export function storeClass(store) {
  return "store-" + store.toLowerCase().replace(/[^a-z]+/g, "-");
}
