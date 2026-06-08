import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ReflexId =
  | "Openness"
  | "ManagingTime"
  | "BusinessContext"
  | "UsingTech"
  | "WorkingWithOthers"
  | "RegulatingEmotions";

export type Tag = "Win" | "Friction" | "Decision";

export type Tracker = {
  id: string;
  week: 1 | 2 | 3 | 4;
  note: string;
  tag: Tag;
  createdAt: string;
};

export type WeekChoice = {
  optionId: string;
  customTitle?: string;
  customBlurb?: string;
};

export type FrictionEntry = {
  id: string;
  workflow: string;
  whatWorked: string;
  whatBroke: string;
  author: string;
};

export type EvidenceItem = {
  id: string;
  title: string;
  owner: string;
  link: string;
  notes: string;
};

export type DecisionRecord = {
  id: string;
  workflow: string;
  decision: "Scale" | "Stop" | "Shift";
  evidence: string;
};

export type RetroResponse = {
  strongerReflex?: ReflexId;
  weakerReflex?: ReflexId;
  notes: string;
};

export type Sprint = {
  id: string;
  ownerName: string;
  role: string;
  teamType: string;
  topWorkflows: string;
  desiredOutcome: string;
  focalReflexes: ReflexId[];
  weeks: { 1?: WeekChoice; 2?: WeekChoice; 3?: WeekChoice; 4?: WeekChoice };
  startDate: string;
  rhythmPartner: string;
  commitment: string;
  tracker: Tracker[];
  friction: FrictionEntry[];
  evidence: EvidenceItem[];
  decisions: DecisionRecord[];
  retro: RetroResponse;
  status: "Draft" | "Active" | "Closed";
};

const empty = (): Sprint => ({
  id: crypto.randomUUID(),
  ownerName: "",
  role: "",
  teamType: "",
  topWorkflows: "",
  desiredOutcome: "",
  focalReflexes: [],
  weeks: {},
  startDate: "",
  rhythmPartner: "",
  commitment: "",
  tracker: [],
  friction: [],
  evidence: [],
  decisions: [],
  retro: { notes: "" },
  status: "Draft",
});

const KEY = "reflex-sprint:v1";

type Ctx = {
  sprint: Sprint;
  update: (p: Partial<Sprint>) => void;
  reset: () => void;
};

const SprintCtx = createContext<Ctx | null>(null);

export function SprintProvider({ children }: { children: React.ReactNode }) {
  const [sprint, setSprint] = useState<Sprint>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return empty();
  });

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(sprint));
      } catch {}
    }, 250);
    return () => clearTimeout(t);
  }, [sprint]);

  const update = useCallback((p: Partial<Sprint>) => {
    setSprint((s) => ({ ...s, ...p }));
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(KEY);
    setSprint(empty());
  }, []);

  const value = useMemo(() => ({ sprint, update, reset }), [sprint, update, reset]);
  return <SprintCtx.Provider value={value}>{children}</SprintCtx.Provider>;
}

export function useSprint() {
  const c = useContext(SprintCtx);
  if (!c) throw new Error("useSprint must be used inside SprintProvider");
  return c;
}

export const REFLEXES: { id: ReflexId; name: string; blurb: string; substrate?: boolean }[] = [
  { id: "Openness", name: "Openness to New Experiences", blurb: "Experimentation and tolerance for ambiguity." },
  { id: "ManagingTime", name: "Managing Time", blurb: "Creating learning space when work is shifting." },
  { id: "BusinessContext", name: "Understanding Business Context", blurb: "Why this change matters to outcomes." },
  { id: "UsingTech", name: "Using Technology Effectively", blurb: "Confidence to troubleshoot and iterate." },
  { id: "WorkingWithOthers", name: "Working Well With Others", blurb: "Normalizing change socially through peers." },
  { id: "RegulatingEmotions", name: "Regulating Emotions", blurb: "Tolerating temporary incompetence; the substrate that holds the others up.", substrate: true },
];

export const MICRO_PRACTICES = [
  {
    name: "Normalize learning language",
    without: "Without it, people hide confusion and stall.",
    practice: "Use words that reframe mistakes as data.",
    sayit: "We are experimenting. This is version one. We will improve through iteration.",
  },
  {
    name: "Create small, frequent practice moments",
    without: "Without it, AI stays a novelty, not a habit.",
    practice: "Schedule tiny repeatable reps inside the work week.",
    sayit: "Fifteen minutes, every Tuesday, one experiment — then we show each other at standup.",
  },
  {
    name: "Connect every change to meaning",
    without: "Without it, change feels like extra work.",
    practice: "Always link the experiment to a customer or business outcome.",
    sayit: "We are trying this so we can answer customers in hours, not days.",
  },
];

export const WEEKS = [
  {
    n: 1 as const,
    label: "Open the sprint",
    color: "var(--coral)",
    reinforces: "Understanding Business Context",
    goal: "By end of Week 1, your team should know where agents can create value and what success looks like.",
    options: [
      { id: "WorkflowInventory", name: "Workflow Inventory", blurb: "Each person lists 3–5 weekly workflows, rates each on AI suitability and business impact, and picks a focal workflow." },
      { id: "OutcomeAnchor", name: "Outcome Anchor", blurb: "Manager names one customer or business outcome the sprint must move; every experiment ladders to it." },
      { id: "TeamBaseline", name: "Team Baseline", blurb: "Three-question survey: current AI usage (1–5), confidence (1–5), and one thing each person wants to learn." },
    ],
    ownPrompt: "Write in any activity that opens the sprint and points the team at where agents can create value",
  },
  {
    n: 2 as const,
    label: "Daily rep",
    color: "var(--amber)",
    reinforces: "Create small, frequent practice moments",
    goal: "By end of Week 2, your team should be actively using agents and learning from real-world experimentation.",
    options: [
      { id: "FrictionLog", name: "Friction Log", blurb: "Shared log with columns workflow / what worked / what broke. Manager seeds entry one so friction is welcomed, not punished." },
      { id: "WeeklyExperiment", name: "15-Minute Weekly Experiment", blurb: "Same 15-minute slot every week. One experiment per person. Share at the next standup." },
      { id: "WhatITried", name: "What I Tried Round", blurb: "Each standup, two-minute round per person on what they tried and what they learned." },
    ],
    ownPrompt: "Write in any activity that creates a daily rep so agents become a reflex",
  },
  {
    n: 3 as const,
    label: "Social proof",
    color: "var(--violet)",
    reinforces: "Working Well With Others",
    goal: "By end of Week 3, your team should be building confidence through shared successes and peer learning.",
    options: [
      { id: "DemoDay", name: "10-Minute Demo Day", blurb: "10-minute team demo. One screen-share. One takeaway each." },
      { id: "AsyncDemo", name: "Async Demo Channel", blurb: "Teams channel for short Loom-style demos with a one-line caption." },
      { id: "PairPilots", name: "Pair Pilots", blurb: "Pair two people on the same workflow for a week; compare notes." },
    ],
    ownPrompt: "Write in any activity that builds confidence through shared successes and peer learning",
  },
  {
    n: 4 as const,
    label: "Close the sprint",
    color: "var(--teal)",
    reinforces: "Understanding Business Context",
    goal: "By end of Week 4, your team should be turning successful experiments into lasting habits and measurable impact.",
    options: [
      { id: "ScaleStopShift", name: "Scale-Stop-Shift Review", blurb: "Each workflow gets one paragraph of evidence and a decision: scale, stop, or shift." },
      { id: "ReflexRetro", name: "Reflex Retro", blurb: "Which reflex got stronger? Which is still weak — focus for next sprint?" },
      { id: "LeaderEvidencePack", name: "Leader Evidence Pack", blurb: "One-page evidence pack assembled from tracker data to share up." },
    ],
    ownPrompt: "Write in any activity that turns successful experiments into lasting habits and measurable impact",
  },
];

export const RECS: Record<ReflexId, Record<1 | 2 | 3 | 4, string>> = {
  Openness: { 1: "OutcomeAnchor", 2: "WhatITried", 3: "AsyncDemo", 4: "ReflexRetro" },
  ManagingTime: { 1: "WorkflowInventory", 2: "WeeklyExperiment", 3: "AsyncDemo", 4: "ScaleStopShift" },
  BusinessContext: { 1: "OutcomeAnchor", 2: "WeeklyExperiment", 3: "DemoDay", 4: "LeaderEvidencePack" },
  UsingTech: { 1: "WorkflowInventory", 2: "WeeklyExperiment", 3: "PairPilots", 4: "ScaleStopShift" },
  WorkingWithOthers: { 1: "TeamBaseline", 2: "WhatITried", 3: "DemoDay", 4: "ReflexRetro" },
  RegulatingEmotions: { 1: "TeamBaseline", 2: "FrictionLog", 3: "AsyncDemo", 4: "ReflexRetro" },
};
