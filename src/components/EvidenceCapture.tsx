import { useState } from "react";
import { useSprint } from "../store";
import { TextField } from "./Field";

export function EvidenceCapture() {
  const { sprint, update } = useSprint();
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");

  const isValid = title.trim().length > 0;

  const handleAdd = () => {
    if (!isValid) return;
    update({
      evidence: [...sprint.evidence, { id: crypto.randomUUID(), title, owner, link, notes }],
    });
    setTitle("");
    setOwner("");
    setLink("");
    setNotes("");
  };

  const handleDelete = (id: string) => {
    update({
      evidence: sprint.evidence.filter((e) => e.id !== id),
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Evidence capture (Week 3 activity)</h2>
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <TextField label="Title" value={title} onCommit={setTitle} />
        <TextField label="Owner" value={owner} onCommit={setOwner} />
        <TextField label="Link" value={link} onCommit={setLink} type="url" placeholder="https://..." />
        <TextField label="Notes" value={notes} onCommit={setNotes} />
        <button
          onClick={handleAdd}
          disabled={!isValid}
          className="w-full px-4 py-2 rounded-md bg-[var(--navy)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          aria-label="Capture evidence"
        >
          Capture evidence
        </button>
      </div>
      <div className="space-y-2 mt-2">
        {sprint.evidence.length === 0 && <div className="text-sm text-slate-500">No evidence captured yet.</div>}
        {sprint.evidence
          .slice()
          .reverse()
          .map((e) => (
            <div key={e.id} className="bg-white p-3 rounded-md shadow-sm text-sm flex justify-between items-start gap-2">
              <div className="flex-1">
                <div>
                  <strong>{e.title}</strong> <span className="text-slate-500">— {e.owner}</span>
                </div>
                {e.link && (
                  <div className="text-blue-600 underline truncate">
                    <a href={e.link} target="_blank" rel="noreferrer" aria-label={`Link: ${e.title}`}>
                      {e.link}
                    </a>
                  </div>
                )}
                {e.notes && <div className="text-slate-500">{e.notes}</div>}
              </div>
              <button
                onClick={() => handleDelete(e.id)}
                className="text-slate-400 hover:text-red-600 transition-colors px-2 py-1 flex-shrink-0"
                aria-label={`Delete evidence: ${e.title}`}
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
