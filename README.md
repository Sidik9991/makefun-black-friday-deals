# Black Friday Deal Finder 2026

![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)
![Rank](https://make.fun/badge/black-friday-deal-finder-01/Sidik9991/makefun-black-friday-deals/rank.svg)
![Reward](https://make.fun/badge/black-friday-deal-finder-01/Sidik9991/makefun-black-friday-deals/reward.svg)

A Black Friday deal finder with **40 deals checked on 27 Nov 2026** at **Amazon, Best Buy, Walmart and Target** — 11 categories, from TVs and laptops to toys and vacuums. Built for the [black-friday-deal-finder-01 bounty on make.fun](https://make.fun/c/black-friday-deal-finder-01).

Every deal shows the product, the store, a link to it there, the sale price, the usual price, the discount, when the price was checked, where the price came from — and an honest verdict on whether it is really a deal (Strong deal / Good deal / Routine / Check first). The same product is compared across stores wherever we found it at more than one: Beats Studio Pro is $149 at Amazon and $99 at Walmart, so the finder says so.

Search, filter by category, store, discount and verdict, and sort by biggest discount, most dollars saved, lowest price or best verdict. Works on desktop and on a phone. The site is plain static files under `app/` — no build step, no network request at runtime.

## How the prices were checked

Each price was checked on 27 Nov 2026 on the store's own product page or in a deals roundup that names the store — PopSci's Amazon roundup, Best Buy and Walmart store pages, Target's store page, TopSave and the MacRumors roundup. Two deals carry a warning instead of a clean verdict: Pokémon Legends: Z-A (TopSave reported $39.88 on 26 Nov, but Walmart's own page showed $59.99 in an older crawl) and Beats Solo Buds Ivory (selling fast, some crawls show it out of stock). Prices move fast on Black Friday — the store link is the final word.

## Run it

```sh
node serve.ts   # app/ on http://localhost:8080
```

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's library in `vendor/`.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
