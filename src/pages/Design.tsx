import { useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSprint, REFLEXES, WEEKS, RECS, ReflexId } from "../store";
import { TextField } from "../components/Field";

// Type definitions
type StepProps = {
  sprint: ReturnType<typeof useSprint>["sprint"];
  update: ReturnType<typeof useSprint>["update"];
};

// ============ Reusable Components ============

const ProgressBar = memo(({ step }: { step: number }) => {
  const pct = Math.round((step / 7) * 100);
  return (
    <div className="h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
      <div className="h-full bg-[var(--blue)] transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
});

const StepHeader = memo(({ step }: { step: number }) => (
  <div>
    <h1 className="text-2xl font-bold">Design your sprint</h1>
    <div className="text-sm text-slate-500 mt-1">Step {step} of 7</div>
    <ProgressBar step={step} />
  </div>
));

const getButtonClass = (selected: boolean) =>
  `text-left p-5 rounded-xl border-2 transition ${
    selected
      ? "border-[var(--blue)] bg-blue-50"
      : "border-slate-200 bg-white hover:border-slate-300"
  }`;

const getOptionButtonClass = (selected: boolean) =>
  `text-left p-4 rounded-lg border-2 transition ${
    selected ? "border-[var(--blue)] bg-blue-50" : "border-slate-200 hover:border-slate-300"
  }`;

// ============ Step Components ============

const StepRole = memo(({ sprint, update }: StepProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <TextField
      label="Your role"
      value={sprint.role}
      onCommit={(v) => update({ role: v })}
      placeholder="e.g. Director of Strategy"
    />
    <TextField
      label="Team type"
      value={sprint.teamType}
      onCommit={(v) => update({ teamType: v })}
      placeholder="e.g. Cross-functional strategy team"
    />
    <TextField
      label="Top 2–3 workflows you want agents to help with"
      multiline
      value={sprint.topWorkflows}
      onCommit={(v) => update({ topWorkflows: v })}
      placeholder="One per line"
    />
    <TextField
      label="Outcome you want to move"
      value={sprint.desiredOutcome}
      onCommit={(v) => update({ desiredOutcome: v })}
      placeholder="e.g. cut prep time for QBRs by 30%"
    />
  </div>
));

const ReflexButton = memo(
  ({ reflex, selected, onToggle }: { reflex: (typeof REFLEXES)[0]; selected: boolean; onToggle: () => void }) => (
    <button key={reflex.id} onClick={onToggle} className={getButtonClass(selected)}>
      <div className="font-semibold flex items-center gap-2">
        {reflex.name}
        {reflex.substrate && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-[var(--pink)]">substrate</span>
        )}
      </div>
      <div className="text-sm text-slate-600 mt-1">{reflex.blurb}</div>
      {selected && <div className="mt-2 text-xs text-[var(--blue)] font-semibold">✓ Selected</div>}
    </button>
  )
);

const StepReflexes = memo(({ sprint, update }: StepProps) => {
  const toggleReflex = useCallback(
    (id: ReflexId) =>
      update({
        focalReflexes: sprint.focalReflexes.includes(id)
          ? sprint.focalReflexes.filter((x) => x !== id)
          : [...sprint.focalReflexes, id],
      }),
    [sprint.focalReflexes, update]
  );

  return (
    <div>
      <p className="text-sm text-slate-500 mb-4">
        Pick one or more reflexes to strengthen. Recommendations on the weekly menu will use your first selection as the
        anchor.
      </p>
      <div className="grid md:grid-cols-3 gap-3">
        {REFLEXES.map((r) => (
          <ReflexButton
            key={r.id}
            reflex={r}
            selected={sprint.focalReflexes.includes(r.id)}
            onToggle={() => toggleReflex(r.id)}
          />
        ))}
      </div>
    </div>
  );
});

const WeekOption = memo(
  ({
    option,
    selected,
    recommended,
    onSelect,
  }: {
    option: (typeof WEEKS)[0]["options"][0];
    selected: boolean;
    recommended: boolean;
    onSelect: () => void;
  }) => (
    <button key={option.id} onClick={onSelect} className={getOptionButtonClass(selected)}>
      <div className="font-semibold flex items-center gap-2">
        {option.name}
        {recommended && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⭐ Suggested</span>}
      </div>
      <div className="text-sm text-slate-600 mt-1">{option.blurb}</div>
    </button>
  )
);

const DesignOwnSection = memo(
  ({
    isOwn,
    week,
    chosen,
    onSelect,
    onUpdateTitle,
    onUpdateBlurb,
  }: {
    isOwn: boolean;
    week: (typeof WEEKS)[0];
    chosen: (typeof WEEKS)[0]["options"][0] | undefined;
    onSelect: () => void;
    onUpdateTitle: (v: string) => void;
    onUpdateBlurb: (v: string) => void;
  }) => (
    <div
      className={`p-4 rounded-lg border-2 border-dashed ${
        isOwn ? "border-[var(--blue)] bg-blue-50" : "border-slate-300"
      }`}
    >
      <button onClick={onSelect} className="font-semibold text-left w-full">
        Design your own
      </button>
      <div className="text-xs text-slate-500 mt-1">{week.ownPrompt}</div>
      {isOwn && (
        <div className="mt-3">
          <TextField
            label="Activity name"
            value={chosen?.customTitle || ""}
            onCommit={onUpdateTitle}
          />
          <TextField label="How it works" multiline value={chosen?.customBlurb || ""} onCommit={onUpdateBlurb} />
        </div>
      )}
    </div>
  )
);

const StepWeek = memo(({ sprint, update, step }: StepProps & { step: number }) => {
  const w = WEEKS[step - 3];
  const chosen = sprint.weeks[w.n];
  const seed = sprint.focalReflexes[0];
  const recommended = seed ? RECS[seed][w.n] : null;
  const isOwn = chosen?.optionId === "DesignYourOwn";

  const setWeek = useCallback(
    (n: 1 | 2 | 3 | 4, optionId: string, custom?: { title: string; blurb: string }) =>
      update({
        weeks: {
          ...sprint.weeks,
          [n]: {
            optionId,
            customTitle: custom ? custom.title : "",
            customBlurb: custom ? custom.blurb : "",
          },
        },
      }),
    [sprint.weeks, update]
  );

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
          <WeekOption
            key={o.id}
            option={o}
            selected={chosen?.optionId === o.id}
            recommended={recommended === o.id}
            onSelect={() => setWeek(w.n, o.id)}
          />
        ))}
        <DesignOwnSection
          isOwn={isOwn}
          week={w}
          chosen={chosen}
          onSelect={() =>
            setWeek(w.n, "DesignYourOwn", {
              title: chosen?.customTitle || "",
              blurb: chosen?.customBlurb || "",
            })
          }
          onUpdateTitle={(v) =>
            setWeek(w.n, "DesignYourOwn", { title: v, blurb: chosen?.customBlurb || "" })
          }
          onUpdateBlurb={(v) =>
            setWeek(w.n, "DesignYourOwn", { title: chosen?.customTitle || "", blurb: v })
          }
        />
      </div>
    </div>
  );
});

const StepCommit = memo(({ sprint, update }: StepProps) => (
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
));

const StepNavigation = memo(
  ({
    step,
    onBack,
    onNext,
    onSave,
  }: {
    step: number;
    onBack: () => void;
    onNext: () => void;
    onSave: () => void;
  }) => (
    <div className="flex justify-between">
      <button
        disabled={step === 1}
        onClick={onBack}
        className="px-4 py-2 rounded-md bg-slate-200 disabled:opacity-40"
      >
        Back
      </button>
      {step < 7 ? (
        <button onClick={onNext} className="px-4 py-2 rounded-md bg-[var(--navy)] text-white">
          Next
        </button>
      ) : (
        <button onClick={onSave} className="px-4 py-2 rounded-md bg-[var(--coral)] text-white">
          Save & Review
        </button>
      )}
    </div>
  )
);

// ============ Main Component ============

export default function Design() {
  const { sprint, update } = useSprint();
  const nav = useNavigate();
  const [step, setStep] = useState(1);

  const handleBack = useCallback(() => setStep((s) => s - 1), []);
  const handleNext = useCallback(() => setStep((s) => s + 1), []);
  const handleSave = useCallback(() => {
    update({ status: "Active" });
    nav("/summary");
  }, [update, nav]);

  return (
    <div className="space-y-6">
      <StepHeader step={step} />

      {step === 1 && <StepRole sprint={sprint} update={update} />}
      {step === 2 && <StepReflexes sprint={sprint} update={update} />}
      {step >= 3 && step <= 6 && <StepWeek sprint={sprint} update={update} step={step} />}
      {step === 7 && <StepCommit sprint={sprint} update={update} />}

      <StepNavigation step={step} onBack={handleBack} onNext={handleNext} onSave={handleSave} />
    </div>
  );
}
