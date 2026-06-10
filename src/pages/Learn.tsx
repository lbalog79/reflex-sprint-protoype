import { REFLEXES, MICRO_PRACTICES } from "../store";

interface ReflexCardProps {
  id: string;
  name: string;
  blurb: string;
  substrate?: boolean;
}

function ReflexCard({ name, blurb, substrate }: ReflexCardProps) {
  return (
    <div
      className="bg-white p-5 rounded-xl shadow-sm transition-all hover:shadow-md"
      style={substrate ? { boxShadow: "0 0 0 2px var(--pink)" } : undefined}
    >
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-slate-600 mt-2">{blurb}</div>
      {substrate && (
        <div className="mt-3 inline-block text-xs px-2 py-1 rounded-full bg-pink-50 text-[var(--pink)] font-medium">
          The substrate
        </div>
      )}
    </div>
  );
}

interface PracticeCardProps {
  name: string;
  without: string;
  practice: string;
  sayit: string;
}

function PracticeCard({ name, without, practice, sayit }: PracticeCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-slate-600 mt-2">
        <strong>Without it:</strong> {without}
      </div>
      <div className="text-sm text-slate-600 mt-1">
        <strong>The practice:</strong> {practice}
      </div>
      <blockquote className="mt-3 p-3 rounded-md bg-yellow-50 border-l-4 border-[var(--amber)] text-sm">
        <div className="font-semibold text-yellow-800 mb-1">Say it like this…</div>
        <div className="italic text-yellow-900">"{sayit}"</div>
      </blockquote>
    </div>
  );
}

interface GridProps {
  children: React.ReactNode;
}

function CardGrid({ children }: GridProps) {
  return <div className="grid md:grid-cols-3 gap-4">{children}</div>;
}

export default function Learn() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold">The six change reflexes</h1>
        <p className="text-slate-500 mt-1">
          Reflexes are the underlying capabilities that make change stick. Regulating Emotions is the substrate — it holds
          the other five up.
        </p>
      </section>

      <section>
        <CardGrid>
          {REFLEXES.map((r) => (
            <ReflexCard
              key={r.id}
              id={r.id}
              name={r.name}
              blurb={r.blurb}
              substrate={r.substrate}
            />
          ))}
        </CardGrid>
      </section>

      <section>
        <h2 className="text-xl font-bold">Three micro-practices</h2>
        <p className="text-slate-500 mt-1">Small, repeatable moves that build the reflexes in your team.</p>
      </section>

      <section>
        <CardGrid>
          {MICRO_PRACTICES.map((p) => (
            <PracticeCard
              key={p.name}
              name={p.name}
              without={p.without}
              practice={p.practice}
              sayit={p.sayit}
            />
          ))}
        </CardGrid>
      </section>

      <section className="bg-gradient-to-r from-blue-50 to-green-50 p-5 rounded-xl">
        <div className="font-semibold">The payoff</div>
        <div className="mt-2 text-sm">
          Teams who run this cadence are <strong>3.5x</strong> more likely to achieve healthy adoption and <strong>2.2x</strong>{" "}
          more likely to maintain well-being through the change. (Gartner)
        </div>
      </section>
    </div>
  );
}
