# 🃏 Basic Instinct

> *Trust your basic instinct.*

**Basic Instinct** is a casino table-game **strategy trainer**. Play the games where your decisions actually move the house edge — blackjack, Ultimate Texas Hold'em, video poker, Three Card Poker — and get every single decision graded against the real math. No real money, ever; the only thing at risk is your ego.

The name is the pun: in blackjack, the optimal decision chart is literally called **basic strategy**. This app trains your basic (strategy) instinct.

## What it does

- 🎓 **Every decision graded** — after each move you get a 👍/👎 with the expected value of every option you had, and the exact dollar cost of any mistake.
- 📉 **Implied vs. actual house edge** — each game shows the house edge under perfect play, and *your* edge based on how you've actually played: `your edge = implied edge + EV you gave up ÷ total wagered`. Play perfectly and they converge.
- 💰 **Bankroll & bets** — one shared bankroll across games, add funds at any time, change your bet size between every hand.
- 📊 **Session stats** — decision accuracy, EV given up, net result, per game (persisted locally).

## The games & the math

| Game | Decisions graded by | Edge (perfect play) |
|---|---|---|
| **Blackjack** (6D, S17, DAS, 3:2) | Full EV engine: stand/hit/double/split EVs computed recursively vs. every dealer upcard (infinite-deck model, memoized). The overall implied edge is derived from the same model, so grading and edge are self-consistent. | ~0.57% |
| **Video Poker** — Jacks or Better 9/6, Bonus Poker 8/5, Double Double Bonus 9/6, full-pay Deuces Wild; 1/3/5/10 hands | **Exact** EV: all 32 hold masks × every possible draw from the 47 unseen cards (up to ~2.6M hand evaluations per deal, in a web worker). | 0.46% / 0.83% / 1.02% / **−0.76%** (yes, full-pay Deuces Wild favors the player) |
| **Ultimate Texas Hold'em** | River: exact (990 dealer combos). Flop: exact (1,081 runouts × 990 dealer hands, ~1M evaluations in a worker). Preflop: the optimal strategy chart for the verdict + Monte Carlo (2,500 deals, common random numbers) for the EV estimate. | 2.19% of ante |
| **Three Card Poker** | Exact: all 18,424 dealer hands enumerated. Learn why Q-6-4 is the line. | 3.37% of ante |

Games like craps and baccarat are intentionally absent — once you've bet, there's no decision left to train.

## Running it

```bash
cd frontend
npm install
npm run dev      # dev server (respects PORT / --port)
npm test         # 39 unit tests: strategy charts, evaluators, settlement rules
npm run build    # production build
```

React 18 + Vite 5 + TypeScript. No backend — all EV math runs client-side, with the heavy enumeration in web workers. Session state lives in `localStorage`.

## Project layout

```
frontend/src/
  lib/
    cards.ts            deck / card model (0..51)
    blackjack/          EV engine + game state machine
    poker/              5-card, 7-card and deuces-wild evaluators
    videopoker/         pay tables + exact hold analysis (worker)
    uth/                settlement, preflop chart, exact/MC analysis (worker)
    threecard/          exact play/fold analysis
  games/                one component per game
  components/           cards, edge panel, decision feedback, bet controls
  store/                bankroll + per-game session stats
```

## License

MIT — play responsibly, which here just means: split your eights.
