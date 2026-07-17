import React, { createContext, useContext, useEffect, useReducer } from 'react';

export interface GameStats {
  wagered: number; // total base wagers ($)
  decisions: number;
  correct: number;
  evLost: number; // $ of EV given up vs perfect play
  net: number; // actual $ won/lost
  rounds: number;
}

export interface SessionState {
  bankroll: number;
  stats: Record<string, GameStats>;
  animations: boolean;
}

const EMPTY_STATS: GameStats = { wagered: 0, decisions: 0, correct: 0, evLost: 0, net: 0, rounds: 0 };

type Action =
  | { type: 'addFunds'; amount: number }
  | { type: 'spend'; amount: number; game: string }
  | { type: 'receive'; amount: number; game: string }
  | { type: 'wager'; game: string; amount: number }
  | { type: 'decision'; game: string; correct: boolean; evLost: number }
  | { type: 'round'; game: string }
  | { type: 'resetStats'; game: string }
  | { type: 'toggleAnimations' };

function statsFor(state: SessionState, game: string): GameStats {
  return state.stats[game] ?? EMPTY_STATS;
}

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case 'addFunds':
      return { ...state, bankroll: state.bankroll + action.amount };
    case 'spend': {
      const s = statsFor(state, action.game);
      return {
        ...state,
        bankroll: state.bankroll - action.amount,
        stats: { ...state.stats, [action.game]: { ...s, net: s.net - action.amount } },
      };
    }
    case 'receive': {
      const s = statsFor(state, action.game);
      return {
        ...state,
        bankroll: state.bankroll + action.amount,
        stats: { ...state.stats, [action.game]: { ...s, net: s.net + action.amount } },
      };
    }
    case 'wager': {
      const s = statsFor(state, action.game);
      return {
        ...state,
        stats: { ...state.stats, [action.game]: { ...s, wagered: s.wagered + action.amount } },
      };
    }
    case 'decision': {
      const s = statsFor(state, action.game);
      return {
        ...state,
        stats: {
          ...state.stats,
          [action.game]: {
            ...s,
            decisions: s.decisions + 1,
            correct: s.correct + (action.correct ? 1 : 0),
            evLost: s.evLost + action.evLost,
          },
        },
      };
    }
    case 'round': {
      const s = statsFor(state, action.game);
      return {
        ...state,
        stats: { ...state.stats, [action.game]: { ...s, rounds: s.rounds + 1 } },
      };
    }
    case 'resetStats':
      return { ...state, stats: { ...state.stats, [action.game]: EMPTY_STATS } };
    case 'toggleAnimations':
      return { ...state, animations: !state.animations };
  }
}

const STORAGE_KEY = 'afgh-session-v1';

function load(): SessionState {
  // build-time prerendering has no browser storage — use defaults
  if (typeof window === 'undefined') return { bankroll: 1000, stats: {}, animations: true };
  // default animations off for users who ask the OS for reduced motion
  const prefersReduced =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const defaults: SessionState = { bankroll: 1000, stats: {}, animations: !prefersReduced };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SessionState>;
      if (typeof parsed.bankroll === 'number' && parsed.stats) {
        return { ...defaults, ...parsed } as SessionState;
      }
    }
  } catch {
    /* fresh start */
  }
  return defaults;
}

interface SessionCtx {
  state: SessionState;
  addFunds(amount: number): void;
  spend(game: string, amount: number): void;
  receive(game: string, amount: number): void;
  wager(game: string, amount: number): void;
  decision(game: string, correct: boolean, evLost: number): void;
  round(game: string): void;
  resetStats(game: string): void;
  gameStats(game: string): GameStats;
  toggleAnimations(): void;
}

const Ctx = createContext<SessionCtx | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const ctx: SessionCtx = {
    state,
    addFunds: (amount) => dispatch({ type: 'addFunds', amount }),
    spend: (game, amount) => dispatch({ type: 'spend', game, amount }),
    receive: (game, amount) => dispatch({ type: 'receive', game, amount }),
    wager: (game, amount) => dispatch({ type: 'wager', game, amount }),
    decision: (game, correct, evLost) => dispatch({ type: 'decision', game, correct, evLost }),
    round: (game) => dispatch({ type: 'round', game }),
    resetStats: (game) => dispatch({ type: 'resetStats', game }),
    gameStats: (game) => state.stats[game] ?? EMPTY_STATS,
    toggleAnimations: () => dispatch({ type: 'toggleAnimations' }),
  };

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

export function useSession(): SessionCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSession outside provider');
  return ctx;
}
