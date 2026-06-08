import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSprint, REFLEXES, WEEKS, RECS, ReflexId } from "../store";
import { TextField } from "../components/Field";

export default function Design() {
  const { sprint, update } = useSprint();
  const nav = useNavigate();
  const [step, setStep] = useState(1);

  const toggleReflex = (id: ReflexId) =>
    update({
      focalReflexes: sprint.focalReflexes.includes(id)
        ? sprint.focalReflexes.filter((x) => x !== id)
        : [...sprint.focalReflexes, id],
    });

  const setWeek = (n: 1 | 2 | 3 | 4, optionId: string, custom?: { title: string; blurb: string }) =>
    update({
      weeks: {
        ...sprint.weeks,
        [n]: {
          optionId,
          customTitle: custom ? custom.title : "",
          customBlurb: custom ? custom.blurb : "",
        },
      },
    });

  const seed = sprint.focalReflexes[0];
  const pct = Math.round((step / 7) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Design your sprint</h1>
        <div className="text-sm text-slate-500 mt-1">Step {step} of 7</div>
        <div className="h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-[var(--blue)] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <TextField label="Your role" value={sprint.role} onCommit={(v) => update({ role: v })} placeholder="e.g. Director of Strategy" />
          <TextField label="Team type" value={sprint.teamType} onCommit={(v) => update({ teamType: v })} placeholder="e.g. Cross-functional strategy team" />
          <TextField label="Top 2–3 workflows you want agents to help with" multiline value={sprint.topWorkflows} onCommit={(v) => update({ topWorkflows: v })} placeholder="One per line" />
          <TextField label="Outcome you want to move" value={sprint.desiredOutcome} onCommit={(v) => update({ desiredOutcome: v })} placeholder="e.g. cut prep time for QBRs by 30%" />
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-sm text-slate-500 mb-4">
            Pick one or more reflexes to strengthen. Recommendations on the weekly menu will use your first selection as the
            anchor.
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {REFLEXES.map((r) => {
              const on = sprint.focalReflexes.includes(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => toggleReflex(r.id)}
                  className={`text-left p-5 rounded-xl border-2 transition ${
                    on ? "border-[var(--blue)] bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="font-semibold flex items-center gap-2">
                    {r.name}
                    {r.substrate && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-[var(--pink)]">substrate</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{r.blurb}</div>
                  {on && <div className="mt-2 text-xs text-[var(--blue)] font-semibold">✓ Selected</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step >= 3 && step <= 6 && (() => {
        const w = WEEKS[step - 3];
        const chosen = sprint.weeks[w.n];
        const recommended = seed ? RECS[seed][w.n] : null;
        const isOwn = chosen && chosen.optionId === "DesignYourOwn";
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm" style={{ borderTop: `4px solid ${w.color}` }}>
            <div className="text-xs font-bold uppercase tracking-wide" style={{ color: w.color }}>
              Week {w.n} — {w.label}
            </div>
            <div className="text-slate-700 mt-2">
              <strong>Goal:</strong> {w.goal}
            </div>
            <div className="text-sm text-slate-500 mt-1">Reinforces: {w.reinforces}</div>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              {w.options.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setWeek(w.n, o.id)}
                  className={`text-left p-4 rounded-lg border-2 transition ${
                    chosen?.optionId === o.id
                      ? "border-[var(--blue)] bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="font-semibold flex items-center gap-2">
                    {o.name}
                    {recommended === o.id && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⭐ Suggested</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{o.blurb}</div>
                </button>
              ))}
              <div
                className={`p-4 rounded-lg border-2 border-dashed ${
                  isOwn ? "border-[var(--blue)] bg-blue-50" : "border-slate-300"
                }`}
              >
                <button
                  onClick={() =>
                    setWeek(w.n, "DesignYourOwn", {
                      title: chosen?.customTitle || "",
                      blurb: chosen?.customBlurb || "",
                    })
                  }
                  className="font-semibold text-left w-full"
                >
                  Design your own
                </button>
                <div className="text-xs text-slate-500 mt-1">{w.ownPrompt}</div>
                {isOwn && (
                  <div className="mt-3">
                    <TextField
                      label="Activity name"
                      value={chosen?.customTitle || ""}
                      onCommit={(v) =>
                        setWeek(w.n, "DesignYourOwn", { title: v, blurb: chosen?.customBlurb || "" })
                      }
                    />
                    <TextField
                      label="How it works"
                      multiline
                      value={chosen?.customBlurb || ""}
                      onCommit={(v) =>
                        setWeek(w.n, "DesignYourOwn", { title: chosen?.customTitle || "", blurb: v })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {step === 7 && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <label className="block text-sm mb-3">
            <span className="block mb-1 font-medium text-slate-700">Sprint start date</span>
            <input
              type="date"
              value={sprint.startDate}
              onChange={(e) => update({ startDate: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <TextField
            label="Rhythm partner (the teammate who keeps cadence with you)"
            value={sprint.rhythmPartner}
            onCommit={(v) => update({ rhythmPartner: v })}
          />
          <TextField
            label="For the next 30 days, I will…"
            multiline
            maxLength={280}
            value={sprint.commitment}
            onCommit={(v) => update({ commitment: v })}
            placeholder="One sentence. Keep it concrete."
          />
          <div className="mt-3 p-3 rounded-md bg-yellow-50 border-l-4 border-[var(--amber)] text-sm italic">
            "We are experimenting. We will improve through iteration. Fifteen minutes, one experiment, every week."
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          disabled={step === 1}
          onClick={() => setStep((s) => s - 1)}
          className="px-4 py-2 rounded-md bg-slate-200 disabled:opacity-40"
        >
          Back
        </button>
        {step < 7 ? (
          <button onClick={() => setStep((s) => s + 1)} className="px-4 py-2 rounded-md bg-[var(--navy)] text-white">
            Next
          </button>
        ) : (
          <button
            onClick={() => {
              update({ status: "Active" });
              nav("/summary");
            }}
            className="px-4 py-2 rounded-md bg-[var(--coral)] text-white"
          >
            Save & Review
          </button>
        )}
      </div>
    </div>
  );
}
