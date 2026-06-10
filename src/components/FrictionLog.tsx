import { useState } from "react";
import { useSprint } from "../store";
import { TextField } from "./Field";

export function FrictionLog() {
  const { sprint, update } = useSprint();
  const [workflow, setWorkflow] = useState("");
  const [worked, setWorked] = useState("");
  const [broke, setBroke] = useState("");
  const [author, setAuthor] = useState(sprint.ownerName);

  const isValid = workflow.trim().length > 0;

  const handleAdd = () => {
    if (!isValid) return;
    update({
      friction: [
        ...sprint.friction,
        { id: crypto.randomUUID(), workflow, whatWorked: worked, whatBroke: broke, author },
      ],
    });
    setWorkflow("");
    setWorked("");
    setBroke("");
  };

  const handleDelete = (id: string) => {
    update({
      friction: sprint.friction.filter((f) => f.id !== id),
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Friction Log (Week 2 activity)</h2>
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <TextField label="Workflow" value={workflow} onCommit={setWorkflow} />
        <TextField label="What worked" value={worked} onCommit={setWorked} />
        <TextField label="What broke" value={broke} onCommit={setBroke} />
        <TextField label="Author" value={author} onCommit={setAuthor} />
        <button
          onClick={handleAdd}
          disabled={!isValid}
          className="w-full px-4 py-2 rounded-md bg-[var(--navy)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          aria-label="Add friction log entry"
        >
          Add friction log entry
        </button>
      </div>
      <div className="space-y-2 mt-2">
        {sprint.friction.length === 0 && <div className="text-sm text-slate-500">No entries yet.</div>}
        {sprint.friction
          .slice()
          .reverse()
          .map((f) => (
            <div key={f.id} className="bg-white p-3 rounded-md shadow-sm text-sm flex justify-between items-start gap-2">
              <div className="flex-1">
                <div>
                  <strong>{f.workflow}</strong> <span className="text-slate-500">— {f.author}</span>
                </div>
                <div className="mt-1">
                  <span className="text-green-700">Worked:</span> {f.whatWorked || "—"}
                </div>
                <div>
                  <span className="text-red-700">Broke:</span> {f.whatBroke || "—"}
                </div>
              </div>
              <button
                onClick={() => handleDelete(f.id)}
                className="text-slate-400 hover:text-red-600 transition-colors px-2 py-1 flex-shrink-0"
                aria-label={`Delete friction log: ${f.workflow}`}
                title="Delete entry"
              >
                ✕
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
