# 🃏 A Few Good Hands

> *You can't handle the truth… about your 16 vs 10.*

**A Few Good Hands** (formerly *Basic Instinct*) is a free casino table-game **strategy trainer**. Play the games where your decisions actually move the house edge — blackjack, Ultimate Texas Hold'em, video poker, Three Card Poker — and get every single decision graded against the real math. No real money, ever.

🌐 Live: **https://afewgoodhands.com** (Azure Static Web Apps)

## What it does

- 🎓 **Every decision graded** — after each move you get a 👍/👎 with the expected value of every option you had, and the exact dollar cost of any mistake.
- 📉 **Implied vs. actual house edge** — each game shows the house edge under perfect play, and *your* edge based on how you've actually played: `your edge = implied edge + EV you gave up ÷ total wagered`. Play perfectly and they converge.
- 💰 **Bankroll & bets** — one shared play-money bankroll across games, add funds at any time, change your bet size between every hand.
- 📊 **Session stats** — decision accuracy, EV given up, net result, per game (persisted in `localStorage`; nothing leaves the browser).

## The games & the math

| Game | Decisions graded by | Edge (perfect play) |
|---|---|---|
| **Blackjack** (6D, S17, DAS, 3:2) | Full EV engine: stand/hit/double/split EVs computed recursively vs. every dealer upcard (infinite-deck model, memoized). The overall implied edge is derived from the same model, so grading and edge are self-consistent. | ~0.57% |
| **Video Poker** — Jacks or Better 9/6, Bonus Poker 8/5, Double Double Bonus 9/6, full-pay Deuces Wild; 1/3/5/10 hands | **Exact** EV: all 32 hold masks × every possible draw from the 47 unseen cards (up to ~2.6M hand evaluations per deal, in a web worker). | 0.46% / 0.83% / 1.02% / **−0.76%** |
| **Ultimate Texas Hold'em** | River: exact (990 dealer combos). Flop: exact (1,081 runouts × 990 dealer hands, in a worker). Preflop: the optimal strategy chart + Monte Carlo (2,500 deals) for the EV estimate. | 2.19% of ante |
| **Three Card Poker** | Exact: all 18,424 dealer hands enumerated. Learn why Q-6-4 is the line. | 3.37% of ante |

Games like craps and baccarat are intentionally absent — once you've bet, there's no decision left to train.

## Running it

```bash
cd frontend
npm install
npm run dev      # dev server (respects PORT / --port)
npm test         # unit tests: strategy charts, evaluators, settlement rules
npm run build    # production build (dist/)
```

React 18 + Vite 5 + TypeScript. No backend — all EV math runs client-side, with the heavy enumeration in web workers.

## Hosting & monetization

- **Hosting:** Azure Static Web Apps (Free tier). `frontend/public/staticwebapp.config.json` provides the SPA fallback for the path-based routes. Deploy: `npm run build` then `npx @azure/static-web-apps-cli deploy ./dist --deployment-token <token> --env production`.
- **AdSense:** ad units are wired but dormant. To enable after account approval: set `ADSENSE_CLIENT` and the slot ids in `frontend/src/config.ts`, uncomment/update the publisher line in `frontend/public/ads.txt`, rebuild, redeploy.
- **SEO:** per-route titles/descriptions, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml`.

## Legal posture (see `/legal` in the app)

- Free educational trainer: play money only, no prizes, no deposits — with disclaimers to stay inside ad-network policies for simulated-gambling content (legal-age audience, "no real-money gambling" statements).
- "Ultimate Texas Hold'em" and "Three Card Poker" are trademarks of Bally Gaming / Light & Wonder; the names are used nominatively to teach the publicly known rules and math, with a disclaimer of affiliation.
- Site content © 2026 John Garrison; code is MIT licensed (see `LICENSE`).

## Project layout

```
frontend/src/
  config.ts             site name/URL, AdSense IDs
  lib/                  card model, evaluators, per-game EV engines (+ workers)
  games/                one component per game
  components/           cards, edge panel, decision feedback, bet controls, ad slot
  pages/LegalPage.tsx   terms, privacy, trademark & gambling disclaimers
  store/                bankroll + per-game session stats
frontend/public/        robots.txt, sitemap.xml, ads.txt, staticwebapp.config.json
```

## License

MIT — play responsibly, which here just means: split your eights.
