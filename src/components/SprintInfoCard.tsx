import { FocalReflexes } from "./FocalReflexes";
import type { Sprint } from "../store";

interface SprintInfoCardProps {
  sprint: Sprint;
}

/**
 * Display sprint metadata (start date, partner, reflexes, commitment)
 */
export function SprintInfoCard({ sprint }: SprintInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="text-sm text-slate-500">Start date · Rhythm partner</div>
      <div className="font-medium text-base">
        {sprint.startDate || "—"} · {sprint.rhythmPartner || "—"}
      </div>

      <div className="text-sm text-slate-500 mt-3">Focal reflex(es)</div>
      <div>
        <FocalReflexes reflexIds={sprint.focalReflexes} />
      </div>

      <div className="text-sm text-slate-500 mt-3">Commitment</div>
      <div className="italic">
        "For the next 30 days, {sprint.commitment || "…"}"
      </div>
    </div>
  );
}
