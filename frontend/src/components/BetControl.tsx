interface Props {
  label: string;
  value: number;
  onChange(v: number): void;
  disabled?: boolean;
  chips?: number[];
}

export function BetControl({ label, value, onChange, disabled, chips = [5, 25, 100] }: Props) {
  return (
    <div className="bet-controls">
      <label>{label}</label>
      <input
        type="number"
        min={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
      />
      {chips.map((c) => (
        <button key={c} className="chip-btn" disabled={disabled} onClick={() => onChange(value + c)}>
          +{c}
        </button>
      ))}
      <button className="chip-btn" disabled={disabled} onClick={() => onChange(chips[0])}>
        reset
      </button>
    </div>
  );
}
