import { useState } from "react";
import { useSprint, REFLEXES, ReflexId } from "../store";
import { TextField } from "../components/Field";
import { evidencePackText, openEvidencePdf } from "../export";

export default function Close() {
  const { sprint, update } = useSprint();
  const [workflow, setWorkflow] = useState("");
  const [decision, setDecision] = useState<"Scale" | "Stop" | "Shift">("Scale");
  const [evidence, setEvidence] = useState("");

  const w4 = sprint.weeks[4];
  const showDecisions = w4 && w4.optionId === "ScaleStopShift";

  const setRetro = (p: Partial<typeof sprint.retro>) => update({ retro: { ...sprint.retro, ...p } });

  const addDecision = () => {
    if (!workflow.trim()) return;
    update({
      decisions: [...sprint.decisions, { id: crypto.randomUUID(), workflow, decision, evidence }],
    });
    setWorkflow("");
    setEvidence("");
  };

  const wins = sprint.tracker.filter((t) => t.tag === "Win").length;
  const fric = sprint.tracker.filter((t) => t.tag === "Friction").length;
  const dec = sprint.tracker.filter((t) => t.tag === "Decision").length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Close & retro</h1>

      {showDecisions && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Scale-Stop-Shift decisions</h2>
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <TextField label="Workflow" value={workflow} onCommit={setWorkflow} />
            <label className="block text-sm mb-3">
              <span className="block mb-1 font-medium text-slate-700">Decision</span>
              <select
                value={decision}
                onChange={(e) => setDecision(e.target.value as any)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option>Scale</option>
                <option>Stop</option>
                <option>Shift</option>
              </select>
            </label>
            <TextField label="Evidence (one paragraph)" multiline value={evidence} onCommit={setEvidence} />
            <button onClick={addDecision} className="w-full px-4 py-2 rounded-md bg-[var(--navy)] text-white">
              Add decision
            </button>
          </div>
          <div className="space-y-2 mt-2">
            {sprint.decisions.map((d) => (
              <div key={d.id} className="bg-white p-3 rounded-md shadow-sm text-sm">
                <div>
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold mr-2 ${
                      d.decision === "Scale"
                        ? "bg-green-100 text-green-800"
                        : d.decision === "Stop"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {d.decision}
                  </span>
                  <strong>{d.workflow}</strong>
                </div>
                <div className="text-slate-600 mt-1">{d.evidence}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-2">Reflex Retro</h2>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <label className="block text-sm mb-3">
            <span className="block mb-1 font-medium text-slate-700">Which reflex got stronger this sprint?</span>
            <select
              value={sprint.retro.strongerReflex || ""}
              onChange={(e) => setRetro({ strongerReflex: (e.target.value || undefined) as ReflexId })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {REFLEXES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm mb-3">
            <span className="block mb-1 font-medium text-slate-700">
              Which reflex is still weak — focus for next sprint?
            </span>
            <select
              value={sprint.retro.weakerReflex || ""}
              onChange={(e) => setRetro({ weakerReflex: (e.target.value || undefined) as ReflexId })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {REFLEXES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <TextField label="Retro notes" multiline value={sprint.retro.notes} onCommit={(v) => setRetro({ notes: v })} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border-2 border-[var(--navy)]">
        <h3 className="text-lg font-bold text-[var(--navy)]">Leader Evidence Pack</h3>
        <div className="text-sm text-slate-500">Auto-generated from your tracker entries, decisions, and retro.</div>
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="text-center p-4 rounded-md bg-slate-50">
            <div className="text-3xl font-bold text-[var(--navy)]">{wins}</div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Wins</div>
          </div>
          <div className="text-center p-4 rounded-md bg-slate-50">
            <div className="text-3xl font-bold text-[var(--navy)]">{fric}</div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Frictions</div>
          </div>
          <div className="text-center p-4 rounded-md bg-slate-50">
            <div className="text-3xl font-bold text-[var(--navy)]">{dec}</div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Decisions</div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              navigator.clipboard.writeText(evidencePackText(sprint));
              alert("Evidence pack copied.");
            }}
            className="px-3 py-2 rounded-md bg-slate-200"
          >
            Copy evidence pack
          </button>
          <button onClick={() => openEvidencePdf(sprint)} className="px-3 py-2 rounded-md bg-[var(--navy)] text-white">
            Export evidence PDF
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          update({ status: "Closed" });
          alert("Sprint marked closed.");
        }}
        className="px-4 py-2 rounded-md bg-[var(--teal)] text-white"
      >
        Mark sprint closed
      </button>
    </div>
  );
}
