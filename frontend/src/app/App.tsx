import { useState } from "react";
import { AnimatePresence } from "motion/react";

import { User, Page } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Background } from "./components/Background";

import LoginPage from "./pages/LoginPage";
import MemberDashboard from "./pages/MemberDashboard";
import MyReportsPage from "./pages/MyReportsPage";
import CreateReportPage from "./pages/CreateReportPage";
import ManagerOverview from "./pages/ManagerOverview";
import TeamReportsPage from "./pages/TeamReportsPage";
import ProjectsPage from "./pages/ProjectsPage";
import AIChatPage from "./pages/AIChatPage";
import { PageWrap } from "./components/PageWrap";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("dashboard");

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen flex bg-black" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Background />
      <Sidebar page={page} setPage={setPage} user={user} setUser={setUser} />

      <main className="flex-1 overflow-auto">
        <div className="relative z-20 p-8 max-w-7xl">
          <AnimatePresence mode="wait">
            {page === "dashboard" && user.role === "member" && (
              <MemberDashboard key="member-dash" user={user} setPage={setPage} />
            )}
            {page === "dashboard" && user.role === "manager" && (
              <ManagerOverview key="manager-dash" user={user}/>
            )}
            {page === "reports" && <MyReportsPage key="reports" setPage={setPage} user={user} />}
            {page === "create-report" && <CreateReportPage key="create" setPage={setPage} user={user} />}
            {page === "team" && <TeamReportsPage key="team" user={user} />}
            {page === "projects" && <ProjectsPage key="projects" user={user} />}
            {page === "ai-chat" && <AIChatPage key="chat" user={user} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
