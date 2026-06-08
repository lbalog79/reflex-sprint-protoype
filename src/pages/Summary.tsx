import { useSprint, WEEKS, REFLEXES } from "../store";
import { planText, openPlanPdf, downloadIcs } from "../export";

export default function Summary() {
  const { sprint } = useSprint();

  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const range = (n: number) => {
    if (!sprint.startDate) return "";
    const s = new Date(sprint.startDate + "T00:00:00");
    const a = new Date(s);
    a.setDate(a.getDate() + 7 * (n - 1));
    const b = new Date(a);
    b.setDate(b.getDate() + 6);
    return `${fmt(a)} – ${fmt(b)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Sprint plan summary</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              navigator.clipboard.writeText(planText(sprint));
              alert("Plan copied to clipboard.");
            }}
            className="px-3 py-2 rounded-md bg-slate-200"
          >
            Copy plan
          </button>
          <button onClick={() => openPlanPdf(sprint)} className="px-3 py-2 rounded-md bg-[var(--navy)] text-white">
            Export PDF
          </button>
          <button onClick={() => downloadIcs(sprint)} className="px-3 py-2 rounded-md bg-[var(--amber)] text-[var(--navy)]">
            Add to Outlook
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="text-sm text-slate-500">Start date · Rhythm partner</div>
        <div className="font-medium text-base">
          {sprint.startDate || "—"} · {sprint.rhythmPartner || "—"}
        </div>
        <div className="text-sm text-slate-500 mt-3">Focal reflex(es)</div>
        <div>
          {sprint.focalReflexes.length === 0 && "—"}
          {sprint.focalReflexes.map((id) => {
            const r = REFLEXES.find((x) => x.id === id);
            return (
              <span key={id} className="inline-block text-xs px-3 py-1 rounded-full bg-blue-50 text-[var(--blue)] mr-2 mb-2">
                {r ? r.name : id}
              </span>
            );
          })}
        </div>
        <div className="text-sm text-slate-500 mt-3">Commitment</div>
        <div className="italic">"For the next 30 days, {sprint.commitment || "…"}"</div>
      </div>

      <h2 className="text-lg font-semibold">Weekly plan</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {WEEKS.map((w) => {
          const c = sprint.weeks[w.n];
          const name = c
            ? c.optionId === "DesignYourOwn"
              ? c.customTitle || "(custom)"
              : w.options.find((o) => o.id === c.optionId)?.name || "—"
            : "Not chosen";
          return (
            <div key={w.n} className="bg-white p-5 rounded-xl shadow-sm" style={{ borderTop: `4px solid ${w.color}` }}>
              <div className="text-xs font-bold uppercase tracking-wide" style={{ color: w.color }}>
                Week {w.n} — {w.label}
              </div>
              <div className="text-sm text-slate-600 mt-2">
                <strong>Goal:</strong> {w.goal}
              </div>
              <div className="text-xs text-slate-500 mt-1">{range(w.n)}</div>
              <div className="font-semibold mt-3">Activity: {name}</div>
            </div>
          );
        })}
      </div>

      {sprint.startDate && (
        <>
          <h2 className="text-lg font-semibold">30-day calendar</h2>
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 30 }).map((_, i) => {
                const d = new Date(sprint.startDate + "T00:00:00");
                d.setDate(d.getDate() + i);
                const wn = Math.ceil((i + 1) / 7);
                const bg =
                  wn === 1
                    ? "rgba(255,90,60,.15)"
                    : wn === 2
                    ? "rgba(244,169,60,.18)"
                    : wn === 3
                    ? "rgba(108,92,224,.18)"
                    : "rgba(23,176,166,.18)";
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-md flex flex-col items-center justify-center text-sm font-semibold"
                    style={{ background: bg }}
                  >
                    {d.getDate()}
                    <span className="text-[9px] opacity-70 font-medium">W{wn}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
