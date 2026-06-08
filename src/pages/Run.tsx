import { useState } from "react";
import { useSprint, Tag, MICRO_PRACTICES } from "../store";
import { TextField } from "../components/Field";

export default function Run() {
  const { sprint, update } = useSprint();
  const day = sprint.startDate
    ? Math.min(30, Math.max(1, Math.floor((Date.now() - new Date(sprint.startDate).getTime()) / 86400000) + 1))
    : 0;
  const cw = day === 0 ? 1 : Math.min(4, Math.ceil(day / 7));

  const [week, setWeek] = useState<1 | 2 | 3 | 4>(cw as 1 | 2 | 3 | 4);
  const [note, setNote] = useState("");
  const [tag, setTag] = useState<Tag>("Win");

  const addEntry = () => {
    if (!note.trim()) return;
    update({
      tracker: [
        ...sprint.tracker,
        { id: crypto.randomUUID(), week, tag, note, createdAt: new Date().toISOString() },
      ],
    });
    setNote("");
  };

  const w2 = sprint.weeks[2];
  const w3 = sprint.weeks[3];
  const showFriction = w2 && w2.optionId === "FrictionLog";
  const showEvidence = w3 && (w3.optionId === "DemoDay" || w3.optionId === "AsyncDemo" || w3.optionId === "PairPilots");

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Run — weekly tracker</h1>
          {sprint.startDate ? (
            <p className="text-sm text-slate-500 mt-1">
              Today: Day {day} of 30 — Week {cw}
            </p>
          ) : (
            <p className="text-sm text-slate-500 mt-1">Set a start date in Design to activate the schedule.</p>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="font-semibold mb-3">Add a tracker entry</div>
          <div className="grid md:grid-cols-4 gap-3">
            <label className="text-sm">
              <span className="block mb-1 font-medium text-slate-700">Week</span>
              <select
                value={week}
                onChange={(e) => setWeek(Number(e.target.value) as 1 | 2 | 3 | 4)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    Week {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="block mb-1 font-medium text-slate-700">Tag</span>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as Tag)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option>Win</option>
                <option>Friction</option>
                <option>Decision</option>
              </select>
            </label>
            <label className="text-sm md:col-span-2">
              <span className="block mb-1 font-medium text-slate-700">Note</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What happened?"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <button onClick={addEntry} className="mt-3 w-full px-4 py-2 rounded-md bg-[var(--navy)] text-white">
            Add entry
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Tracker entries</h2>
          <div className="space-y-2">
            {sprint.tracker.length === 0 && <div className="text-sm text-slate-500">No entries yet.</div>}
            {sprint.tracker
              .slice()
              .reverse()
              .map((t) => (
                <div key={t.id} className="bg-white p-3 rounded-md shadow-sm flex justify-between text-sm">
                  <span>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold mr-2 ${
                        t.tag === "Win"
                          ? "bg-green-100 text-green-800"
                          : t.tag === "Friction"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {t.tag}
                    </span>
                    W{t.week} — {t.note}
                  </span>
                  <span className="text-slate-400 text-xs">{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
          </div>
        </div>

        {showFriction && <FrictionLog />}
        {showEvidence && <EvidenceCapture />}
      </div>

      <aside>
        <div className="bg-white p-5 rounded-xl shadow-sm sticky top-4">
          <div className="font-semibold mb-3">Say it like this…</div>
          {MICRO_PRACTICES.map((p) => (
            <div key={p.name} className="mb-3 p-3 rounded-md bg-yellow-50 border-l-4 border-[var(--amber)] text-sm">
              <div className="font-semibold text-yellow-800 mb-1">{p.name}</div>
              <div className="italic">"{p.sayit}"</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function FrictionLog() {
  const { sprint, update } = useSprint();
  const [workflow, setWorkflow] = useState("");
  const [worked, setWorked] = useState("");
  const [broke, setBroke] = useState("");
  const [author, setAuthor] = useState(sprint.ownerName);

  const add = () => {
    if (!workflow.trim()) return;
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

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Friction Log (Week 2 activity)</h2>
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <TextField label="Workflow" value={workflow} onCommit={setWorkflow} />
        <TextField label="What worked" value={worked} onCommit={setWorked} />
        <TextField label="What broke" value={broke} onCommit={setBroke} />
        <TextField label="Author" value={author} onCommit={setAuthor} />
        <button onClick={add} className="w-full px-4 py-2 rounded-md bg-[var(--navy)] text-white">
          Add friction log entry
        </button>
      </div>
      <div className="space-y-2 mt-2">
        {sprint.friction.length === 0 && <div className="text-sm text-slate-500">No entries yet.</div>}
        {sprint.friction
          .slice()
          .reverse()
          .map((f) => (
            <div key={f.id} className="bg-white p-3 rounded-md shadow-sm text-sm">
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
          ))}
      </div>
    </div>
  );
}

function EvidenceCapture() {
  const { sprint, update } = useSprint();
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");

  const add = () => {
    if (!title.trim()) return;
    update({
      evidence: [...sprint.evidence, { id: crypto.randomUUID(), title, owner, link, notes }],
    });
    setTitle("");
    setOwner("");
    setLink("");
    setNotes("");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Evidence capture (Week 3 activity)</h2>
      <div className="bg-white p-5 rounded-xl shadow-sm">
        <TextField label="Title" value={title} onCommit={setTitle} />
        <TextField label="Owner" value={owner} onCommit={setOwner} />
        <TextField label="Link" value={link} onCommit={setLink} type="url" placeholder="https://..." />
        <TextField label="Notes" value={notes} onCommit={setNotes} />
        <button onClick={add} className="w-full px-4 py-2 rounded-md bg-[var(--navy)] text-white">
          Capture evidence
        </button>
      </div>
      <div className="space-y-2 mt-2">
        {sprint.evidence.length === 0 && <div className="text-sm text-slate-500">No evidence captured yet.</div>}
        {sprint.evidence
          .slice()
          .reverse()
          .map((e) => (
            <div key={e.id} className="bg-white p-3 rounded-md shadow-sm text-sm">
              <div>
                <strong>{e.title}</strong> <span className="text-slate-500">— {e.owner}</span>
              </div>
              {e.link && (
                <div className="text-blue-600 underline truncate">
                  <a href={e.link} target="_blank" rel="noreferrer">
                    {e.link}
                  </a>
                </div>
              )}
              {e.notes && <div className="text-slate-500">{e.notes}</div>}
            </div>
          ))}
      </div>
    </div>
  );
}
