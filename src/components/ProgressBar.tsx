interface Props {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  showValue?: boolean;
  color?: string;
}

export function ProgressBar({ label, value, max = 100, unit = '%', showValue = true, color }: Props) {
  const percentage = Math.min((value / max) * 100, 100);
  const barColor = color || (percentage >= 85 ? 'bg-red-500' : percentage >= 70 ? 'bg-amber-500' : 'bg-brand-500');

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        {showValue && (
          <span className="text-sm font-semibold text-slate-800">
            {value}
            {unit}
          </span>
        )}
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
