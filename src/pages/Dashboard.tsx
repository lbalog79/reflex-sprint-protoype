import { Link } from "react-router-dom";
import { useSprint, REFLEXES, WEEKS } from "../store";
import { openPlanPdf, downloadIcs } from "../export";

// Constants
const SPRINT_DURATION_DAYS = 30;
const MS_PER_DAY = 86400000;
const CIRCLE_RADIUS = 58;
const MAX_WEEK = 4;

const NAV_ITEMS = [
  { label: "Learn", to: "/learn", color: "var(--blue)", desc: "The model in 5 minutes" },
  { label: "Design", to: "/design", color: "var(--coral)", desc: "Build your sprint plan" },
  { label: "Run", to: "/run", color: "var(--amber)", desc: "Track weekly evidence" },
  { label: "Close", to: "/close", color: "var(--teal)", desc: "Decisions and retro" },
];

// Helper: Calculate sprint progress
const calculateSprintProgress = (startDate: string | null) => {
  if (!startDate) return { day: 0, week: 0, pct: 0 };

  const day = Math.min(
    SPRINT_DURATION_DAYS,
    Math.max(1, Math.floor((Date.now() - new Date(startDate).getTime()) / MS_PER_DAY) + 1)
  );
  const week = Math.min(MAX_WEEK, Math.ceil(day / 7));

  return { day, week, pct: day / SPRINT_DURATION_DAYS };
};

// Helper: Get week name from sprint config
const getWeekName = (week: any, sprint: any) => {
  const config = sprint.weeks[week.n];
  if (!config) return "Not chosen";
  if (config.optionId === "DesignYourOwn") return config.customTitle || "(custom)";
  return week.options.find((o: any) => o.id === config.optionId)?.name || "—";
};

// Component: Focal Reflex Chips
const FocalReflexChips = ({ reflexIds }: { reflexIds: string[] }) => {
  if (reflexIds.length === 0) return null;

  const chips = reflexIds.map((id) => {
    const ref = REFLEXES.find((x) => x.id === id);
    return (
      <span
        key={id}
        className="inline-block text-xs px-3 py-1 rounded-full bg-blue-50 text-[var(--blue)] mr-2 mb-2"
      >
        {ref?.name || id}
      </span>
    );
  });

  return (
    <div>
      <div className="text-sm text-slate-500 mb-2">Focal reflex(es):</div>
      <div>{chips}</div>
    </div>
  );
};

// Component: Circular Progress Indicator
const CircularProgress = ({ day, pct }: { day: number; pct: number }) => {
  const circumference = 2 * Math.PI * CIRCLE_RADIUS;

  return (
    <div className="relative w-36 h-36">
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="70"
          cy="70"
          r={CIRCLE_RADIUS}
          stroke="rgba(255,255,255,.2)"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="70"
          cy="70"
          r={CIRCLE_RADIUS}
          stroke="var(--amber)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-semibold">
        <div className="text-3xl">{day}</div>
        <div className="text-xs opacity-80">of {SPRINT_DURATION_DAYS} days</div>
      </div>
    </div>
  );
};

// Component: Sprint Status Display
const SprintStatus = ({
  sprint,
  day,
  week,
}: {
  sprint: any;
  day: number;
  week: number;
}) => {
  if (!sprint.startDate) {
    return <p className="text-sm">No sprint yet. Head to Design to build one.</p>;
  }

  return (
    <p className="text-sm">
      Status: <strong>{sprint.status}</strong> — Day {day} of {SPRINT_DURATION_DAYS} — currently in Week {week}
    </p>
  );
};

// Component: Navigation Grid
const NavGrid = () => (
  <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {NAV_ITEMS.map(({ label, to, color, desc }) => (
      <Link
        key={to}
        to={to}
        className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition"
      >
        <div
          className="w-8 h-8 rounded-md mb-2 flex items-center justify-center text-white font-bold"
          style={{ background: color }}
        >
          {label[0]}
        </div>
        <div className="font-semibold">{label}</div>
        <div className="text-sm text-slate-500">{desc}</div>
      </Link>
    ))}
  </section>
);

// Component: Week-by-week Snapshot
const WeekSnapshot = ({ sprint }: { sprint: any }) => {
  if (!sprint.startDate) return null;

  return (
    <>
      <h2 className="text-lg font-semibold mt-4">Week-by-week snapshot</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {WEEKS.map((w) => (
          <div
            key={w.n}
            className="bg-white p-4 rounded-xl shadow-sm"
            style={{ borderTop: `4px solid ${w.color}` }}
          >
            <div
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: w.color }}
            >
              Week {w.n}
            </div>
            <div className="font-semibold mt-1">{getWeekName(w, sprint)}</div>
          </div>
        ))}
      </div>
    </>
  );
};

// Component: Commitment Section
const CommitmentSection = ({ commitment }: { commitment: string }) => {
  if (!commitment) return null;

  return (
    <div
      className="bg-white p-5 rounded-xl border-l-4"
      style={{ borderColor: "var(--violet)" }}
    >
      <div className="text-sm text-slate-500">Your commitment:</div>
      <div className="italic mt-1">"For the next 30 days, {commitment}"</div>
    </div>
  );
};

// Main Component
export default function Dashboard() {
  const { sprint } = useSprint();
  const { day, week, pct } = calculateSprintProgress(sprint.startDate);

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-[var(--navy)] to-[var(--violet)] text-white p-8 rounded-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex-1 min-w-[280px]">
          <h1 className="text-3xl font-bold mb-2">
            Turn AI rollout into a 30-day rhythm.
          </h1>
          <p className="opacity-90 mb-3">
            A sprint is a container for repetition. Micro-practices become change
            reflexes.
          </p>
          <SprintStatus sprint={sprint} day={day} week={week} />
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={() => openPlanPdf(sprint)}
              disabled={!sprint.startDate}
              className="bg-white text-[var(--navy)] px-4 py-2 rounded-md font-medium disabled:opacity-40"
            >
              Export PDF
            </button>
            <button
              onClick={() => downloadIcs(sprint)}
              disabled={!sprint.startDate}
              className="bg-[var(--amber)] text-[var(--navy)] px-4 py-2 rounded-md font-medium disabled:opacity-40"
            >
              Add to Outlook (.ics)
            </button>
          </div>
        </div>
        {sprint.startDate && <CircularProgress day={day} pct={pct} />}
      </section>

      <FocalReflexChips reflexIds={sprint.focalReflexes} />

      <NavGrid />

      <WeekSnapshot sprint={sprint} />

      <CommitmentSection commitment={sprint.commitment} />
    </div>
  );
}
