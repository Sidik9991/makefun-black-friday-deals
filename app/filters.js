// Filtering and sorting: pure functions over the deal list.
// One job: given the deals and the controls' state, return the deals to show.

import { pctOff, saved } from "./format.js";

export const SORTS = {
  discount: { label: "Biggest discount", fn: (a, b) => pctOff(b) - pctOff(a) || saved(b) - saved(a) },
  saved: { label: "Most dollars saved", fn: (a, b) => saved(b) - saved(a) || pctOff(b) - pctOff(a) },
  price: { label: "Lowest price", fn: (a, b) => a.sale - b.sale },
  verdict: {
    label: "Best verdict first",
    fn: (a, b) => {
      const rank = { strong: 0, good: 1, routine: 2, check: 3 };
      return rank[a.verdict] - rank[b.verdict] || pctOff(b) - pctOff(a);
    },
  },
};

export function defaultState() {
  return { query: "", category: "All", store: "All", minOff: 0, verdict: "All", sort: "discount" };
}

// Read the controls' state from a URL hash query string, e.g.
// #/?q=dyson&category=TVs&store=Best+Buy&min=30&sort=saved
export function stateFromHash(hash) {
  const state = defaultState();
  const query = (hash.split("?")[1] || "").replace(/^#\/?/, "");
  const params = new URLSearchParams(query);
  if (params.get("q")) state.query = params.get("q");
  if (params.get("category")) state.category = params.get("category");
  if (params.get("store")) state.store = params.get("store");
  const min = Number(params.get("min"));
  if (Number.isFinite(min) && min >= 0 && min <= 90) state.minOff = min;
  if (params.get("verdict")) state.verdict = params.get("verdict");
  if (SORTS[params.get("sort")]) state.sort = params.get("sort");
  return state;
}

export function stateToHash(state) {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category !== "All") params.set("category", state.category);
  if (state.store !== "All") params.set("store", state.store);
  if (state.minOff) params.set("min", String(state.minOff));
  if (state.verdict !== "All") params.set("verdict", state.verdict);
  if (state.sort !== "discount") params.set("sort", state.sort);
  const text = params.toString();
  return text ? "#/?" + text : "#/";
}

export function applyFilters(deals, state) {
  const q = state.query.trim().toLowerCase();
  const list = deals.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (state.verdict !== "All" && d.verdict !== state.verdict) return false;
    if (pctOff(d) < state.minOff) return false;
    if (q) {
      const hay = (d.name + " " + d.store + " " + d.category).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  return [...list].sort(SORTS[state.sort].fn);
}
