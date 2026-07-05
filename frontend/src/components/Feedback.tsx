export interface EVLine {
  label: string;
  ev: number;
  isBest: boolean;
  isChosen: boolean;
}

export interface GradeDisplay {
  correct: boolean;
  chosenLabel: string;
  bestLabel: string;
  costDollars: number;
  lines: EVLine[];
  note?: string;
}

interface Props {
  grade: GradeDisplay | 'pending' | null;
  unitLabel: string; // e.g. "per $ bet" / "in antes"
}

export function FeedbackPanel({ grade, unitLabel }: Props) {
  return (
    <div className={`panel feedback ${grade && grade !== 'pending' ? (grade.correct ? 'good' : 'bad') : ''}`}>
      <h4>Last Decision</h4>
      {grade === null && <div className="pending-dot">Make a move — every decision gets graded against the math.</div>}
      {grade === 'pending' && <div className="pending-dot">Crunching the numbers…</div>}
      {grade !== null && grade !== 'pending' && (
        <>
          <div className="verdict">
            <span className="thumb">{grade.correct ? '👍' : '👎'}</span>
            <span>{grade.correct ? 'Correct play' : 'Costly move'}</span>
          </div>
          <div className="detail">
            You chose <strong>{grade.chosenLabel}</strong>.
            {grade.correct ? (
              <> That is the highest-EV play.</>
            ) : (
              <>
                {' '}
                Best was <strong>{grade.bestLabel}</strong> — that mistake cost{' '}
                <strong>${grade.costDollars.toFixed(2)}</strong> in expected value.
              </>
            )}
            {grade.note && <div>{grade.note}</div>}
          </div>
          {grade.lines.length > 0 && (
            <table className="ev-table">
              <tbody>
                {grade.lines.map((l) => (
                  <tr key={l.label} className={l.isBest ? 'best' : l.isChosen && !l.isBest ? 'chosen-wrong' : ''}>
                    <td>
                      {l.label}
                      {l.isChosen ? ' ←' : ''}
                    </td>
                    <td>
                      {l.ev >= 0 ? '+' : ''}
                      {l.ev.toFixed(4)} {unitLabel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
