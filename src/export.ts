import { Sprint, WEEKS } from "./store";

export function planText(s: Sprint): string {
  const weekActivity = (n: 1 | 2 | 3 | 4) => {
    const c = s.weeks[n];
    if (!c) return "—";
    if (c.optionId === "DesignYourOwn") return `${c.customTitle || "(custom)"} — ${c.customBlurb || ""}`;
    const meta = WEEKS[n - 1].options.find((o) => o.id === c.optionId);
    return meta ? meta.name : c.optionId;
  };

  const weekDates = (n: 1 | 2 | 3 | 4) => {
    if (!s.startDate) return "";
    const start = new Date(s.startDate + "T00:00:00");
    const a = new Date(start);
    a.setDate(a.getDate() + 7 * (n - 1));
    const b = new Date(a);
    b.setDate(b.getDate() + 6);
    const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return `${fmt(a)} – ${fmt(b)}`;
  };

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

  for (let n = 1 as 1 | 2 | 3 | 4; n <= 4; n++) {
    lines.push("");
    lines.push(`Week ${n} — ${WEEKS[n - 1].label} (${weekDates(n)})`);
    lines.push(`  Goal: ${WEEKS[n - 1].goal}`);
    lines.push(`  Activity: ${weekActivity(n)}`);
    n = (n + 1) as 1 | 2 | 3 | 4;
    n = (n - 1) as 1 | 2 | 3 | 4;
  }

  lines.push("");
  lines.push("COMMITMENT");
  lines.push(`For the next 30 days, ${s.commitment || "I will..."}`);
  return lines.join("\n");
}

export function evidencePackText(s: Sprint): string {
  const wins = s.tracker.filter((t) => t.tag === "Win").length;
  const fric = s.tracker.filter((t) => t.tag === "Friction").length;
  const dec = s.tracker.filter((t) => t.tag === "Decision").length;

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

  for (let n = 1; n <= 4; n++) {
    const c = s.weeks[n as 1 | 2 | 3 | 4];
    const activity = c
      ? c.optionId === "DesignYourOwn"
        ? c.customTitle || "(custom)"
        : WEEKS[n - 1].options.find((o) => o.id === c.optionId)?.name || c.optionId
      : "—";
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
    lines.push(`  Reflex grown stronger: ${s.retro.strongerReflex || "—"}`);
    lines.push(`  Reflex still weak (next sprint focus): ${s.retro.weakerReflex || "—"}`);
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
  const safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  w.document.write(
    `<title>Reflex Sprint</title><pre style="font-family:Segoe UI,sans-serif;padding:32px;white-space:pre-wrap;font-size:13px;line-height:1.5">${safe}</pre>`
  );
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

const pad = (n: number) => String(n).padStart(2, "0");
const icsDate = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
const icsDT = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

export function downloadIcs(s: Sprint) {
  if (!s.startDate) return;
  const start = new Date(s.startDate + "T00:00:00Z");
  let events = "";

  WEEKS.forEach((wk) => {
    const a = new Date(start);
    a.setUTCDate(a.getUTCDate() + 7 * (wk.n - 1));
    const b = new Date(a);
    b.setUTCDate(b.getUTCDate() + 7);
    const c = s.weeks[wk.n];
    const title = c
      ? c.optionId === "DesignYourOwn"
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
