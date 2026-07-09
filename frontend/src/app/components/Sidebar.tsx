import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Briefcase,
  BarChart3,
  Plus
} from "lucide-react";
import { User, Page } from "../types";
import { Avatar } from "./Avatar";

interface SidebarProps {
  page: Page;
  setPage: (p: Page) => void;
  user: User;
  setUser: (u: User | null) => void;
}

export function Sidebar({ page, setPage, user, setUser }: SidebarProps) {
  const nav = user.role === "manager"
    ? [
        { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
        { id: "team", icon: Users, label: "Team Reports" },
        { id: "projects", icon: FolderOpen, label: "Projects" },
        { id: "ai-chat", icon: MessageSquare, label: "AI Assistant" }
      ]
    : [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "reports", icon: FileText, label: "My Reports" },
        { id: "create-report", icon: Plus, label: "New Report" },
        { id: "projects", icon: FolderOpen, label: "Projects" },
        { id: "ai-chat", icon: MessageSquare, label: "AI Assistant" }
      ];

  return (
    <aside
      className="w-58 flex-shrink-0 h-screen sticky top-0 flex flex-col"
      style={{
        width: 228,
        background: "rgba(6,13,31,0.88)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        zIndex: 10
      }}
    >
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#4f7bff,#7b5ff8)",
              boxShadow: "0 0 18px rgba(79,123,255,0.45)"
            }}
          >
            <BarChart3 size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-[17px] tracking-tight">WorkPulse</span>
        </div>
      </div>

      <div className="px-4 py-2.5">
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
          style={{
            background: "rgba(79,123,255,0.1)",
            border: "1px solid rgba(79,123,255,0.18)"
          }}
        >
          {user.role === "manager" ? (
            <Shield size={12} style={{ color: "#4f7bff" }} />
          ) : (
            <Briefcase size={12} style={{ color: "#4f7bff" }} />
          )}
          <span className="text-[11px] font-semibold" style={{ color: "#4f7bff" }}>
            {user.role === "manager" ? "Manager View" : "Team Member"}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
        {nav.map(({ id, icon: Icon, label }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => setPage(id as Page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                active
                  ? "text-white"
                  : "text-white/35 hover:text-white/70 hover:bg-white/[0.04]"
              }`}
              style={
                active
                  ? {
                      background:
                        "linear-gradient(135deg,rgba(79,123,255,0.22),rgba(123,95,248,0.14))",
                      border: "1px solid rgba(79,123,255,0.25)",
                      boxShadow: "0 0 18px rgba(79,123,255,0.12)"
                    }
                  : {}
              }
            >
              <Icon size={16} />
              {label}
              {active && (
                <div
                  className="ml-auto w-1 h-3.5 rounded-full"
                  style={{ background: "#4f7bff" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div
        className="p-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all mb-2">
          <Settings size={15} /> Settings
        </button>
        <div className="flex items-center gap-2.5 px-1 py-1">
          <Avatar name={user.name} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-white/85 truncate">
              {user.name}
            </div>
            <div className="text-[10px] text-white/25 truncate">{user.department}</div>
          </div>
          <button
            onClick={() => setUser(null)}
            className="text-white/20 hover:text-red-400 transition-colors p-1"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
