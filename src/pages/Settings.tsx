import { useSprint } from "../store";
import { TextField } from "../components/Field";

export default function Settings() {
  const { sprint, update, reset } = useSprint();

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white p-5 rounded-xl shadow-sm">
        <TextField
          key={sprint.id}
          label="Display name"
          value={sprint.ownerName}
          onCommit={(v) => update({ ownerName: v })}
          placeholder="Your name"
        />
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm text-sm text-slate-600">
        <strong>Responsible AI notice.</strong> Recommendations in this app are suggestions you can override at any time.
        No personal data is collected. All sprint data is stored only in this browser via localStorage.
      </div>

      <button
        onClick={() => {
          if (confirm("Reset the sprint? Plan, tracker entries, decisions, and retro will be cleared.")) {
            reset();
            location.hash = "#/";
          }
        }}
        className="px-4 py-2 rounded-md bg-[var(--pink)] text-white"
      >
        Reset sprint
      </button>
    </div>
  );
}
