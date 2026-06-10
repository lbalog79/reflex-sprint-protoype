import { useSprint } from "../store";
import { TextField } from "../components/Field";

/**
 * Disclaimer component for responsible AI notice
 */
function ResponsibleAINotice() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm text-sm text-slate-600">
      <strong>Responsible AI notice.</strong> Recommendations in this app are
      suggestions you can override at any time. No personal data is collected.
      All sprint data is stored only in this browser via localStorage.
    </div>
  );
}

/**
 * Reset button component with confirmation logic
 */
interface ResetButtonProps {
  onReset: () => void;
}

function ResetButton({ onReset }: ResetButtonProps) {
  const handleClick = () => {
    if (
      confirm(
        "Reset the sprint? Plan, tracker entries, decisions, and retro will be cleared."
      )
    ) {
      onReset();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded-md bg-[var(--pink)] text-white hover:opacity-90 transition-opacity"
      aria-label="Reset sprint data"
    >
      Reset sprint
    </button>
  );
}

/**
 * Settings page for managing sprint configuration
 */
export default function Settings() {
  const { sprint, update, reset } = useSprint();

  const handleReset = () => {
    reset();
    location.hash = "#/";
  };

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
          aria-label="Owner display name"
        />
      </div>

      <ResponsibleAINotice />

      <ResetButton onReset={handleReset} />
    </div>
  );
}
