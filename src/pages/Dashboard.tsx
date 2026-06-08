import { Link } from "react-router-dom";
import { useSprint, REFLEXES, WEEKS } from "../store";
import { openPlanPdf, downloadIcs } from "../export";

export default function Dashboard() {
  const { sprint } = useSprint();
  const day = sprint.startDate
    ? Math.min(30, Math.max(1, Math.floor((Date.now() - new Date(sprint.startDate).getTime()) / 86400000) + 1))
    : 0;
  const week = day === 0 ? 0 : Math.min(4, Math.ceil(day / 7));
  const pct = day / 30;
  const r = 58;
  const c = 2 * Math.PI * r;

  const chips = sprint.focalReflexes.map((id) => {
    const ref = REFLEXES.find((x) => x.id === id);
    return (
      <span key={id} className="inline-block text-xs px-3 py-1 rounded-full bg-blue-50 text-[var(--blue)] mr-2 mb-2">
        {ref ? ref.name : id}
      </span>
    );
  });

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-[var(--navy)] to-[var(--violet)] text-white p-8 rounded-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex-1 min-w-[280px]">
          <h1 className="text-3xl font-bold mb-2">Turn AI rollout into a 30-day rhythm.</h1>
          <p className="opacity-90 mb-3">A sprint is a container for repetition. Micro-practices become change reflexes.</p>
          {sprint.startDate ? (
            <p className="text-sm">
              Status: <strong>{sprint.status}</strong> — Day {day} of 30 — currently in Week {week}
            </p>
          ) : (
            <p className="text-sm">No sprint yet. Head to Design to build one.</p>
          )}
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={() => openPlanPdf(sprint)}
              disabled={!sprint.startDate}
              className="bg-white text-[var(--navy)] px-4 py-2 rounded-md font-medium disabled:opacity-40"
            >
              Export PDF
            </button>
            <button
              onClick={() => downloadIcs(sprint)}
              disabled={!sprint.startDate}
              className="bg-[var(--amber)] text-[var(--navy)] px-4 py-2 rounded-md font-medium disabled:opacity-40"
            >
              Add to Outlook (.ics)
            </button>
          </div>
        </div>
        {sprint.startDate && (
          <div className="relative w-36 h-36">
            <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="70" cy="70" r={r} stroke="rgba(255,255,255,.2)" strokeWidth="10" fill="none" />
              <circle
                cx="70"
                cy="70"
                r={r}
                stroke="var(--amber)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={c}
                strokeDashoffset={c * (1 - pct)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-semibold">
              <div className="text-3xl">{day}</div>
              <div className="text-xs opacity-80">of 30 days</div>
            </div>
          </div>
        )}
      </section>

      {chips.length > 0 && (
        <div>
          <div className="text-sm text-slate-500 mb-2">Focal reflex(es):</div>
          <div>{chips}</div>
        </div>
      )}

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ["Learn", "/learn", "var(--blue)", "The model in 5 minutes"],
          ["Design", "/design", "var(--coral)", "Build your sprint plan"],
          ["Run", "/run", "var(--amber)", "Track weekly evidence"],
          ["Close", "/close", "var(--teal)", "Decisions and retro"],
        ].map(([label, to, color, sub]) => (
          <Link key={to} to={to} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <div
              className="w-8 h-8 rounded-md mb-2 flex items-center justify-center text-white font-bold"
              style={{ background: color }}
            >
              {label[0]}
            </div>
            <div className="font-semibold">{label}</div>
            <div className="text-sm text-slate-500">{sub}</div>
          </Link>
        ))}
      </section>

      {sprint.startDate && (
        <>
          <h2 className="text-lg font-semibold mt-4">Week-by-week snapshot</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WEEKS.map((w) => {
              const c = sprint.weeks[w.n];
              const name = c
                ? c.optionId === "DesignYourOwn"
                  ? c.customTitle || "(custom)"
                  : w.options.find((o) => o.id === c.optionId)?.name || "—"
                : "Not chosen";
              return (
                <div key={w.n} className="bg-white p-4 rounded-xl shadow-sm" style={{ borderTop: `4px solid ${w.color}` }}>
                  <div className="text-xs font-bold uppercase tracking-wide" style={{ color: w.color }}>
                    Week {w.n}
                  </div>
                  <div className="font-semibold mt-1">{name}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {sprint.commitment && (
        <div className="bg-white p-5 rounded-xl border-l-4" style={{ borderColor: "var(--violet)" }}>
          <div className="text-sm text-slate-500">Your commitment:</div>
          <div className="italic mt-1">"For the next 30 days, {sprint.commitment}"</div>
        </div>
      )}
    </div>
  );
}
