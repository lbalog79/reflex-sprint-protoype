import { useState, useCallback } from "react";
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

  // Memoized helper to avoid unnecessary object spreads
  const setRetro = useCallback(
    (p: Partial<typeof sprint.retro>) =>
      update({ retro: { ...sprint.retro, ...p } }),
    [sprint.retro, update]
  );

  // Memoized decision handler with validation
  const addDecision = useCallback(() => {
    if (!workflow.trim()) {
      alert("Please enter a workflow name.");
      return;
    }
    update({
      decisions: [
        ...sprint.decisions,
        { id: crypto.randomUUID(), workflow, decision, evidence },
      ],
    });
    setWorkflow("");
    setEvidence("");
  }, [workflow, decision, evidence, sprint.decisions, update]);

  // Memoized counters using reduce (more efficient)
  const trackerStats = sprint.tracker.reduce(
    (acc, t) => {
      if (t.tag === "Win") acc.wins++;
      else if (t.tag === "Friction") acc.fric++;
      else if (t.tag === "Decision") acc.dec++;
      return acc;
    },
    { wins: 0, fric: 0, dec: 0 }
  );

  // Memoized handlers for export and close actions
  const handleCopyEvidence = useCallback(() => {
    navigator.clipboard.writeText(evidencePackText(sprint)).then(() => {
      alert("Evidence pack copied to clipboard.");
    }).catch((err) => {
      console.error("Failed to copy:", err);
      alert("Failed to copy evidence pack.");
    });
  }, [sprint]);

  const handleExportPdf = useCallback(() => {
    try {
      openEvidencePdf(sprint);
    } catch (err) {
      console.error("Failed to export PDF:", err);
      alert("Failed to export PDF.");
    }
  }, [sprint]);

  const handleMarkClosed = useCallback(() => {
    update({ status: "Closed" });
    alert("Sprint marked closed.");
  }, [update]);

  const getDecisionBadgeClass = (decision: string): string => {
    const baseClass =
      "inline-block text-xs px-2 py-0.5 rounded-full font-semibold mr-2";
    switch (decision) {
      case "Scale":
        return `${baseClass} bg-green-100 text-green-800`;
      case "Stop":
        return `${baseClass} bg-red-100 text-red-800`;
      case "Shift":
        return `${baseClass} bg-blue-100 text-blue-800`;
      default:
        return baseClass;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Close & retro</h1>

      {showDecisions && (
        <section aria-label="Scale-Stop-Shift decisions">
          <h2 className="text-lg font-semibold mb-2">
            Scale-Stop-Shift decisions
          </h2>
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <TextField
              label="Workflow"
              value={workflow}
              onCommit={setWorkflow}
              placeholder="Enter workflow name"
            />
            <label className="block text-sm mb-3">
              <span className="block mb-1 font-medium text-slate-700">
                Decision
              </span>
              <select
                value={decision}
                onChange={(e) =>
                  setDecision(e.target.value as "Scale" | "Stop" | "Shift")
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Scale">Scale</option>
                <option value="Stop">Stop</option>
                <option value="Shift">Shift</option>
              </select>
            </label>
            <TextField
              label="Evidence (one paragraph)"
              multiline
              value={evidence}
              onCommit={setEvidence}
              placeholder="Explain your decision"
            />
            <button
              onClick={addDecision}
              className="w-full px-4 py-2 rounded-md bg-[var(--navy)] text-white hover:opacity-90 transition-opacity"
              aria-label="Add decision"
            >
              Add decision
            </button>
          </div>

          {sprint.decisions.length > 0 && (
            <div className="space-y-2 mt-4">
              {sprint.decisions.map((d) => (
                <div
                  key={d.id}
                  className="bg-white p-3 rounded-md shadow-sm text-sm"
                >
                  <div className="flex items-start gap-2">
                    <span className={getDecisionBadgeClass(d.decision)}>
                      {d.decision}
                    </span>
                    <strong className="flex-1">{d.workflow}</strong>
                  </div>
                  <div className="text-slate-600 mt-2">{d.evidence}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section aria-label="Reflex retrospective">
        <h2 className="text-lg font-semibold mb-2">Reflex Retro</h2>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <label className="block text-sm mb-3">
            <span className="block mb-1 font-medium text-slate-700">
              Which reflex got stronger this sprint?
            </span>
            <select
              value={sprint.retro.strongerReflex || ""}
              onChange={(e) =>
                setRetro({
                  strongerReflex: (e.target.value || undefined) as ReflexId,
                })
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) =>
                setRetro({
                  weakerReflex: (e.target.value || undefined) as ReflexId,
                })
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">—</option>
              {REFLEXES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <TextField
            label="Retro notes"
            multiline
            value={sprint.retro.notes}
            onCommit={(v) => setRetro({ notes: v })}
            placeholder="Reflect on learnings and growth areas"
          />
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl border-2 border-[var(--navy)]" aria-label="Leader evidence pack">
        <h3 className="text-lg font-bold text-[var(--navy)] mb-1">
          Leader Evidence Pack
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Auto-generated from your tracker entries, decisions, and retro.
        </p>
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="text-center p-4 rounded-md bg-slate-50">
            <div className="text-3xl font-bold text-[var(--navy)]">
              {trackerStats.wins}
            </div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Wins
            </div>
          </div>
          <div className="text-center p-4 rounded-md bg-slate-50">
            <div className="text-3xl font-bold text-[var(--navy)]">
              {trackerStats.fric}
            </div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Frictions
            </div>
          </div>
          <div className="text-center p-4 rounded-md bg-slate-50">
            <div className="text-3xl font-bold text-[var(--navy)]">
              {trackerStats.dec}
            </div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Decisions
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleCopyEvidence}
            className="px-3 py-2 rounded-md bg-slate-200 hover:bg-slate-300 transition-colors"
            aria-label="Copy evidence pack to clipboard"
          >
            Copy evidence pack
          </button>
          <button
            onClick={handleExportPdf}
            className="px-3 py-2 rounded-md bg-[var(--navy)] text-white hover:opacity-90 transition-opacity"
            aria-label="Export evidence pack as PDF"
          >
            Export evidence PDF
          </button>
        </div>
      </section>

      <button
        onClick={handleMarkClosed}
        className="px-4 py-2 rounded-md bg-[var(--teal)] text-white hover:opacity-90 transition-opacity"
        aria-label="Mark sprint as closed"
      >
        Mark sprint closed
      </button>
    </div>
  );
}
