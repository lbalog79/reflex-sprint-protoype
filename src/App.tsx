import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import Design from "./pages/Design";
import Summary from "./pages/Summary";
import Run from "./pages/Run";
import Close from "./pages/Close";
import Settings from "./pages/Settings";
import { SprintProvider } from "./store";

export default function App() {
  const links: [string, string][] = [
    ["/", "Dashboard"], ["/learn", "Learn"], ["/design", "Design"],
    ["/summary", "Plan"], ["/run", "Run"], ["/close", "Close"], ["/settings", "Settings"],
  ];
  return (
    <SprintProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-[var(--navy)] text-white px-6 py-3 flex items-center gap-6 flex-wrap">
          <div className="font-semibold text-lg">Reflex Sprint</div>
          <nav className="flex gap-1 text-sm">
            {links.map(([to, l]) => (
              <NavLink key={to} to={to} end={to === "/"}
                className={({ isActive }) => `px-3 py-1.5 rounded-md ${isActive ? "bg-white/20" : "hover:bg-white/10"}`}>
                {l}
              </NavLink>
            ))}
          </nav>
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
