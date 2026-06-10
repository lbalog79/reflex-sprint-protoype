import { Sprint, WEEKS } from "./store";

// Constants for tag values
const TAGS = { WIN: "Win", FRICTION: "Friction", DECISION: "Decision" } as const;
const CUSTOM_OPTION_ID = "DesignYourOwn";
const EMPTY_INDICATOR = "—";

/**
 * Get the activity description for a given week.
 */
function getWeekActivity(week: Sprint['weeks'][1 | 2 | 3 | 4] | undefined, weekIndex: number): string {
  if (!week) return EMPTY_INDICATOR;
  if (week.optionId === CUSTOM_OPTION_ID)
    return `${week.customTitle || "(custom)"} — ${week.customBlurb || ""}`;
  const meta = WEEKS[weekIndex].options.find((o) => o.id === week.optionId);
  return meta?.name || week.optionId;
}

/**
 * Format a date range for a given week.
 */
function formatWeekDates(startDate: string | undefined, n: 1 | 2 | 3 | 4): string {
  if (!startDate) return "";
  const start = new Date(startDate + "T00:00:00");
  if (isNaN(start.getTime())) return "";

  const a = new Date(start);
  a.setDate(a.getDate() + 7 * (n - 1));
  const b = new Date(a);
  b.setDate(b.getDate() + 6);

  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${fmt(a)} – ${fmt(b)}`;
}

export function planText(s: Sprint): string {
  const lines = [
    "REFLEX SPRINT — 30-Day Agentic Adoption Sprint Plan",
    "=".repeat(52),
    "",
    `Owner: ${s.ownerName || "TBD"}`,
    `Role: ${s.role || "TBD"} / Team: ${s.teamType || "TBD"}`,
    `Start date: ${s.startDate || "TBD"}`,
    `Rhythm partner: ${s.rhythmPartner || "TBD"}`,
    `Focal reflex(es): ${s.focalReflexes.join(", ") || "TBD"}`,
    "",
    "DESIRED OUTCOME",
    s.desiredOutcome || "TBD",
    "",
    "TOP WORKFLOWS",
    s.topWorkflows || "TBD",
    "",
    "WEEKLY PLAN",
  ];

  for (const n of [1, 2, 3, 4] as const) {
    lines.push("");
    lines.push(`Week ${n} — ${WEEKS[n - 1].label} (${formatWeekDates(s.startDate, n)})`);
    lines.push(`  Goal: ${WEEKS[n - 1].goal}`);
    lines.push(`  Activity: ${getWeekActivity(s.weeks[n], n - 1)}`);
  }

  lines.push("");
  lines.push("COMMITMENT");
  lines.push(`For the next 30 days, ${s.commitment || "I will..."}`);
  return lines.join("\n");
}

export function evidencePackText(s: Sprint): string {
  const wins = s.tracker.filter((t) => t.tag === TAGS.WIN).length;
  const fric = s.tracker.filter((t) => t.tag === TAGS.FRICTION).length;
  const dec = s.tracker.filter((t) => t.tag === TAGS.DECISION).length;

  const lines = [
    "REFLEX SPRINT — LEADER EVIDENCE PACK",
    "=".repeat(52),
    "",
    `Owner: ${s.ownerName || "TBD"}  |  Sprint window: ${s.startDate || "TBD"} + 30 days`,
    `Focal reflex(es): ${s.focalReflexes.join(", ") || "TBD"}`,
    "",
    "TOTALS",
    `  Wins: ${wins}  |  Frictions: ${fric}  |  Decisions: ${dec}`,
    "",
    "WEEK BY WEEK",
  ];

  for (const n of [1, 2, 3, 4] as const) {
    const activity = getWeekActivity(s.weeks[n], n - 1);
    lines.push("");
    lines.push(`Week ${n} — ${WEEKS[n - 1].label} / ${activity}`);
    s.tracker
      .filter((t) => t.week === n)
      .forEach((t) => lines.push(`  [${t.tag}] ${t.note}`));
  }

  if (s.decisions.length) {
    lines.push("");
    lines.push("DECISIONS");
    s.decisions.forEach((d) => lines.push(`  [${d.decision}] ${d.workflow}: ${d.evidence}`));
  }

  if (s.retro.strongerReflex || s.retro.weakerReflex) {
    lines.push("");
    lines.push("RETRO");
    lines.push(`  Reflex grown stronger: ${s.retro.strongerReflex || EMPTY_INDICATOR}`);
    lines.push(`  Reflex still weak (next sprint focus): ${s.retro.weakerReflex || EMPTY_INDICATOR}`);
    if (s.retro.notes) lines.push(`  Notes: ${s.retro.notes}`);
  }

  return lines.join("\n");
}

export function openPlanPdf(s: Sprint) {
  openPdfText(planText(s));
}

export function openEvidencePdf(s: Sprint) {
  openPdfText(evidencePackText(s));
}

function openPdfText(text: string) {
  const w = window.open("", "_blank");
  if (!w) return;

  const pre = document.createElement("pre");
  pre.style.fontFamily = "Segoe UI, sans-serif";
  pre.style.padding = "32px";
  pre.style.whiteSpace = "pre-wrap";
  pre.style.fontSize = "13px";
  pre.style.lineHeight = "1.5";
  pre.textContent = text;

  w.document.title = "Reflex Sprint";
  w.document.body.appendChild(pre);
  w.focus();

  setTimeout(() => {
    if (w) w.print();
  }, 300);
}

const pad = (n: number) => String(n).padStart(2, "0");
const icsDate = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
const icsDT = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

export function downloadIcs(s: Sprint) {
  if (!s.startDate) return;
  const start = new Date(s.startDate + "T00:00:00Z");
  if (isNaN(start.getTime())) return;

  let events = "";

  WEEKS.forEach((wk) => {
    const a = new Date(start);
    a.setUTCDate(a.getUTCDate() + 7 * (wk.n - 1));
    const b = new Date(a);
    b.setUTCDate(b.getUTCDate() + 7);
    const c = s.weeks[wk.n];
    const title = c
      ? c.optionId === CUSTOM_OPTION_ID
        ? c.customTitle || "Custom activity"
        : wk.options.find((o) => o.id === c.optionId)?.name || "TBD"
      : "TBD";

    events +=
      "BEGIN:VEVENT\r\n" +
      `UID:${crypto.randomUUID()}@reflex-sprint\r\n` +
      `DTSTART;VALUE=DATE:${icsDate(a)}\r\n` +
      `DTEND;VALUE=DATE:${icsDate(b)}\r\n` +
      `SUMMARY:Reflex Sprint W${wk.n} — ${title}\r\n` +
      `DESCRIPTION:${wk.goal.replace(/\n/g, "\\n")}\\n\\nCommitment: ${(s.commitment || "").replace(/\n/g, "\\n")}\r\n` +
      "END:VEVENT\r\n";

    const checkA = new Date(a);
    checkA.setUTCHours(14, 0, 0, 0);
    const checkB = new Date(checkA);
    checkB.setUTCMinutes(15);

    events +=
      "BEGIN:VEVENT\r\n" +
      `UID:${crypto.randomUUID()}@reflex-sprint\r\n` +
      `DTSTART:${icsDT(checkA)}\r\n` +
      `DTEND:${icsDT(checkB)}\r\n` +
      `SUMMARY:Reflex Sprint Check-in W${wk.n}\r\n` +
      `DESCRIPTION:15-minute rhythm check-in with ${s.rhythmPartner || "your rhythm partner"}\r\n` +
      "END:VEVENT\r\n";
  });

  const ics =
    "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Reflex Sprint//EN\r\n" + events + "END:VCALENDAR";
  const blob = new Blob([ics], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "reflex-sprint.ics";
  a.click();
}
