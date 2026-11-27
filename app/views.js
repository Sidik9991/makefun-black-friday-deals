// Page templates: deal cards, the deal detail page and the compare page.
// One job: turn deals into HTML strings. No data lives here, no fetching.

import { CHECKED_ON, DEALS } from "./deals.js";
import { money, pctOff, saved, storeClass, verdictHint, verdictLabel } from "./format.js";

function esc(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function dealCard(deal) {
  const off = pctOff(deal);
  return `
  <article class="card" data-id="${esc(deal.id)}">
    <div class="card-top">
      <span class="badge ${storeClass(deal.store)}">${esc(deal.store)}</span>
      <span class="badge cat">${esc(deal.category)}</span>
      <span class="off">−${off}%</span>
    </div>
    <h3 class="card-name"><a href="#/deal/${esc(deal.id)}">${esc(deal.name)}</a></h3>
    <p class="prices"><span class="sale">${money(deal.sale)}</span> <s class="usual">${money(deal.usual)}</s> <span class="save">save ${money(saved(deal))}</span></p>
    <p class="verdict verdict-${esc(deal.verdict)}" title="${esc(verdictHint(deal.verdict))}">${esc(verdictLabel(deal.verdict))}</p>
    <p class="note">${esc(deal.note)}</p>
    <p class="meta">Checked ${esc(CHECKED_ON)} · <a href="${esc(deal.sourceUrl)}" target="_blank" rel="noopener">${esc(deal.source)}</a></p>
    <div class="card-actions">
      <a class="btn store-link" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} ↗</a>
      <a class="btn ghost" href="#/deal/${esc(deal.id)}">Details</a>
    </div>
  </article>`;
}

export function dealDetail(deal) {
  const off = pctOff(deal);
  const mates = deal.group ? DEALS.filter((d) => d.group === deal.group && d.id !== deal.id) : [];
  const rows = mates
    .map(
      (m) => `<tr><td>${esc(m.store)}</td><td class="num">${money(m.sale)}</td><td class="num">${money(m.usual)}</td><td class="num">−${pctOff(m)}%</td><td><a href="${esc(m.url)}" target="_blank" rel="noopener">View ↗</a></td></tr>`,
    )
    .join("");
  const alsoRows = (deal.also || [])
    .map(
      (a) => `<tr><td>${esc(a.store)}</td><td class="num">${money(a.price)}</td><td colspan="2">${esc(a.note)}</td><td>—</td></tr>`,
    )
    .join("");
  const compareBlock =
    rows || alsoRows
      ? `<section class="compare">
      <h2>Same product, other stores</h2>
      <table>
        <thead><tr><th>Store</th><th>Sale price</th><th>Usual</th><th>Off</th><th></th></tr></thead>
        <tbody>
          <tr class="here"><td>${esc(deal.store)} (this deal)</td><td class="num">${money(deal.sale)}</td><td class="num">${money(deal.usual)}</td><td class="num">−${off}%</td><td></td></tr>
          ${rows}${alsoRows}
        </tbody>
      </table>
      <p class="compare-note">The cheapest row wins. Where a store has no link here, the price comes from the source named on this page.</p>
    </section>`
      : "";
  return `
  <article class="detail">
    <p class="crumbs"><a href="#/">← All deals</a></p>
    <div class="card-top">
      <span class="badge ${storeClass(deal.store)}">${esc(deal.store)}</span>
      <span class="badge cat">${esc(deal.category)}</span>
      <span class="off big">−${off}%</span>
    </div>
    <h2 class="detail-name">${esc(deal.name)}</h2>
    <p class="prices big"><span class="sale">${money(deal.sale)}</span> <s class="usual">${money(deal.usual)}</s> <span class="save">you save ${money(saved(deal))}</span></p>
    <p class="verdict verdict-${esc(deal.verdict)}">${esc(verdictLabel(deal.verdict))} — ${esc(verdictHint(deal.verdict))}</p>
    <p class="note big">${esc(deal.note)}</p>
    <p class="meta">Price checked ${esc(CHECKED_ON)} · Source: <a href="${esc(deal.sourceUrl)}" target="_blank" rel="noopener">${esc(deal.source)}</a></p>
    <div class="card-actions">
      <a class="btn store-link" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} ↗</a>
      ${deal.group ? `<a class="btn ghost" href="#/compare/${esc(deal.group)}">Compare stores</a>` : ""}
    </div>
    ${compareBlock}
  </article>`;
}

export function comparePage(group) {
  const members = DEALS.filter((d) => d.group === group);
  if (!members.length) return `<p class="empty">No comparison for this product.</p>`;
  const first = members[0];
  const rows = members
    .map((m) => {
      const best = m.sale === Math.min(...members.map((x) => x.sale));
      return `<tr class="${best ? "best" : ""}"><td>${esc(m.store)}${best ? " ★ cheapest" : ""}</td><td class="num">${money(m.sale)}</td><td class="num">${money(m.usual)}</td><td class="num">−${pctOff(m)}%</td><td><a href="${esc(m.url)}" target="_blank" rel="noopener">View ↗</a></td></tr>`;
    })
    .join("");
  return `
  <article class="detail">
    <p class="crumbs"><a href="#/">← All deals</a></p>
    <h2 class="detail-name">Compare: ${esc(first.name)}</h2>
    <p class="note big">The same product at every store we checked. Prices checked ${esc(CHECKED_ON)}.</p>
    <table>
      <thead><tr><th>Store</th><th>Sale price</th><th>Usual</th><th>Off</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="meta">Sources: ${members.map((m) => `<a href="${esc(m.sourceUrl)}" target="_blank" rel="noopener">${esc(m.source)}</a>`).join(" · ")}</p>
  </article>`;
}

export function emptyState() {
  return `<p class="empty">No deals match those filters. <a href="#/">Clear the filters</a>.</p>`;
}
