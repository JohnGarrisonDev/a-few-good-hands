import { flopAnalysis, preflopAnalysis, riverAnalysis } from './ev';

interface Req {
  requestId: number;
  stage: 'preflop' | 'flop' | 'river';
  player: number[];
  board: number[];
}

self.onmessage = (e: MessageEvent) => {
  const { requestId, stage, player, board } = e.data as Req;
  let result: unknown;
  if (stage === 'preflop') result = preflopAnalysis(player);
  else if (stage === 'flop') result = flopAnalysis(player, board.slice(0, 3));
  else result = riverAnalysis(player, board);
  (self as unknown as Worker).postMessage({ requestId, stage, result });
};
