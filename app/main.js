// App wiring: boot, hash routing, controls and list rendering.
// One job: connect the data, the filters and the templates to the page.

import { CATEGORIES, CHECKED_ON, DEALS, STORES } from "./deals.js";
import { money, pctOff, saved } from "./format.js";
import { SORTS, applyFilters, defaultState, stateFromHash, stateToHash } from "./filters.js";
import { comparePage, dealCard, dealDetail, emptyState } from "./views.js";

const root = document.getElementById("app");
const totalSaved = DEALS.reduce((sum, d) => sum + saved(d), 0);
const avgOff = Math.round(DEALS.reduce((sum, d) => sum + pctOff(d), 0) / DEALS.length);

function statsBar() {
  return `<p class="stats"><strong>${DEALS.length} deals</strong> · ${STORES.length} stores · ${CATEGORIES.length} categories · <strong>${money(totalSaved)}</strong> total savings · avg −${avgOff}% · all prices checked ${CHECKED_ON}</p>`;
}

function controls(state) {
  const catOptions = ["All", ...CATEGORIES]
    .map((c) => `<option value="${c}"${c === state.category ? " selected" : ""}>${c}</option>`)
    .join("");
  const storeOptions = ["All", ...STORES]
    .map((s) => `<option value="${s}"${s === state.store ? " selected" : ""}>${s}</option>`)
    .join("");
  const verdictOptions = ["All", "strong", "good", "routine", "check"]
    .map((v) => `<option value="${v}"${v === state.verdict ? " selected" : ""}>${v === "All" ? "Any verdict" : v}</option>`)
    .join("");
  const sortOptions = Object.entries(SORTS)
    .map(([key, s]) => `<option value="${key}"${key === state.sort ? " selected" : ""}>${s.label}</option>`)
    .join("");
  const minOptions = [0, 20, 30, 40, 50, 60]
    .map((m) => `<option value="${m}"${m === state.minOff ? " selected" : ""}>${m === 0 ? "Any discount" : "−" + m + "% or more"}</option>`)
    .join("");
  return `
  <form class="controls" id="controls">
    <label class="search">Search <input id="q" type="search" placeholder="Try “dyson”, “TV”, “headphones”…" value="${state.query.replaceAll('"', "&quot;")}" autocomplete="off"></label>
    <label>Category <select id="category">${catOptions}</select></label>
    <label>Store <select id="store">${storeOptions}</select></label>
    <label>Discount <select id="minOff">${minOptions}</select></label>
    <label>Verdict <select id="verdict">${verdictOptions}</select></label>
    <label>Sort by <select id="sort">${sortOptions}</select></label>
    <a class="btn ghost clear" href="#/">Clear</a>
  </form>`;
}

function listView(state) {
  const shown = applyFilters(DEALS, state);
  const cards = shown.map(dealCard).join("");
  return `
  ${statsBar()}
  ${controls(state)}
  <p class="count">Showing <strong>${shown.length}</strong> of ${DEALS.length} deals</p>
  <div class="grid">${cards || emptyState()}</div>`;
}

function render() {
  const hash = location.hash || "#/";
  const dealMatch = hash.match(/^#\/deal\/([\w-]+)/);
  const compareMatch = hash.match(/^#\/compare\/([\w-]+)/);
  if (dealMatch) {
    const deal = DEALS.find((d) => d.id === dealMatch[1]);
    root.innerHTML = deal ? dealDetail(deal) : `<p class="empty">Deal not found. <a href="#/">Back to all deals</a>.</p>`;
    document.title = deal ? deal.name + " — Black Friday Deal Finder" : "Black Friday Deal Finder";
  } else if (compareMatch) {
    root.innerHTML = comparePage(compareMatch[1]);
    document.title = "Compare stores — Black Friday Deal Finder";
  } else {
    const state = stateFromHash(hash);
    root.innerHTML = listView(state);
    document.title = "Black Friday Deal Finder 2026 — 40 checked deals";
    const form = document.getElementById("controls");
    const read = () => ({
      query: document.getElementById("q").value,
      category: document.getElementById("category").value,
      store: document.getElementById("store").value,
      minOff: Number(document.getElementById("minOff").value),
      verdict: document.getElementById("verdict").value,
      sort: document.getElementById("sort").value,
    });
    const update = (keepFocus) => {
      const next = read();
      history.replaceState(null, "", stateToHash(next));
      render();
      if (!keepFocus) return;
      const q = document.getElementById("q");
      if (q) {
        q.focus();
        q.setSelectionRange(q.value.length, q.value.length);
      }
    };
    form.addEventListener("input", (event) => {
      if (event.target.id === "q") {
        clearTimeout(form._t);
        form._t = setTimeout(() => update(true), 200);
      } else {
        update(false);
      }
    });
    form.addEventListener("submit", (event) => event.preventDefault());
  }
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
