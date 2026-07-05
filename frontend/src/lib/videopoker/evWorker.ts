import { analyzeHolds } from './ev';
import { paytableById } from './paytables';

self.onmessage = (e: MessageEvent) => {
  const { requestId, deal, paytableId } = e.data as {
    requestId: number;
    deal: number[];
    paytableId: string;
  };
  const result = analyzeHolds(deal, paytableById(paytableId));
  (self as unknown as Worker).postMessage({ requestId, ...result });
};
