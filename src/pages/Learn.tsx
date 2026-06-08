import { REFLEXES, MICRO_PRACTICES } from "../store";

export default function Learn() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">The six change reflexes</h1>
        <p className="text-slate-500 mt-1">
          Reflexes are the underlying capabilities that make change stick. Regulating Emotions is the substrate — it holds
          the other five up.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {REFLEXES.map((r) => (
          <div
            key={r.id}
            className="bg-white p-5 rounded-xl shadow-sm"
            style={r.substrate ? { boxShadow: "0 0 0 2px var(--pink)" } : undefined}
          >
            <div className="font-semibold">{r.name}</div>
            <div className="text-sm text-slate-600 mt-2">{r.blurb}</div>
            {r.substrate && (
              <div className="mt-3 inline-block text-xs px-2 py-1 rounded-full bg-pink-50 text-[var(--pink)]">
                The substrate
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold">Three micro-practices</h2>
        <p className="text-slate-500 mt-1">Small, repeatable moves that build the reflexes in your team.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {MICRO_PRACTICES.map((p) => (
          <div key={p.name} className="bg-white p-5 rounded-xl shadow-sm">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-slate-600 mt-2">
              <strong>Without it:</strong> {p.without}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              <strong>The practice:</strong> {p.practice}
            </div>
            <div className="mt-3 p-3 rounded-md bg-yellow-50 border-l-4 border-[var(--amber)] text-sm">
              <div className="font-semibold text-yellow-800 mb-1">Say it like this…</div>
              <div className="italic">"{p.sayit}"</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-5 rounded-xl">
        <div className="font-semibold">The payoff</div>
        <div className="mt-2 text-sm">
          Teams who run this cadence are <strong>3.5x</strong> more likely to achieve healthy adoption and <strong>2.2x</strong>{" "}
          more likely to maintain well-being through the change. (Gartner)
        </div>
      </div>
    </div>
  );
}
