import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import Design from "./pages/Design";
import Summary from "./pages/Summary";
import Run from "./pages/Run";
import Close from "./pages/Close";
import Settings from "./pages/Settings";
import { SprintProvider } from "./store";

const NAV_LINKS: [string, string][] = [
  ["/", "Dashboard"],
  ["/learn", "Learn"],
  ["/design", "Design"],
  ["/summary", "Plan"],
  ["/run", "Run"],
  ["/close", "Close"],
  ["/settings", "Settings"],
];

const HEADER_CLASS = "bg-[var(--navy)] text-white px-6 py-3 flex items-center gap-6 flex-wrap";
const NAV_LINK_CLASS = (isActive: boolean) =>
  `px-3 py-1.5 rounded-md ${isActive ? "bg-white/20" : "hover:bg-white/10"}`;

function Navigation() {
  return (
    <nav className="flex gap-1 text-sm">
      {NAV_LINKS.map(([to, label]) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) => NAV_LINK_CLASS(isActive)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function App() {
  return (
    <SprintProvider>
      <div className="min-h-screen flex flex-col">
        <header className={HEADER_CLASS}>
          <div className="font-semibold text-lg">Reflex Sprint</div>
          <Navigation />
        </header>
        <main className="flex-1 p-8 max-w-6xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/design" element={<Design />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/run" element={<Run />} />
            <Route path="/close" element={<Close />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </SprintProvider>
  );
}
