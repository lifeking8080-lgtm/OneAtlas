export const Empty = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="card p-8 text-center"><div className="font-semibold">{title}</div>{hint && <p className="mt-1 text-sm text-slate-400">{hint}</p>}</div>
);
export const DemoNote = () => <p className="text-xs text-amber-300">Prices, dates and context windows are demo seed data and are not verified.</p>;
