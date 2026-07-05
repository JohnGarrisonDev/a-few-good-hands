import { Card, RANKS, SUITS, isRed, rankOf, suitOf } from '../lib/cards';

interface Props {
  card?: Card;
  faceDown?: boolean;
  small?: boolean;
  selectable?: boolean;
  held?: boolean;
  dim?: boolean;
  onClick?: () => void;
}

export function CardView({ card, faceDown, small, selectable, held, dim, onClick }: Props) {
  const cls = ['pcard'];
  if (small) cls.push('sm');
  if (faceDown || card === undefined) {
    cls.push('back');
    return <div className={cls.join(' ')} />;
  }
  if (isRed(card)) cls.push('red');
  if (selectable) cls.push('selectable');
  if (held) cls.push('held');
  if (dim) cls.push('dim');
  return (
    <div className={cls.join(' ')} onClick={onClick}>
      <div className="corner">
        {RANKS[rankOf(card)]}
        <div className="suit">{SUITS[suitOf(card)]}</div>
      </div>
      <div className="pip">{SUITS[suitOf(card)]}</div>
      {held && <div className="held-tag">HELD</div>}
    </div>
  );
}
