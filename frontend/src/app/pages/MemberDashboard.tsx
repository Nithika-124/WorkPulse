import { motion } from "motion/react";
import {
  Plus, FileText, Clock, CheckCircle2, AlertCircle, ArrowUpRight,
  Flame, Eye, FolderOpen, Bot, ChevronRight, Target, TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import { User, Page } from "../types";
import { PageWrap } from "../components/PageWrap";
import { SectionHeader } from "../components/SectionHeader";
import { GlowBtn } from "../components/GlowBtn";
import { StatusBadge } from "../components/StatusBadge";
import { Avatar } from "../components/Avatar";
import { styles } from "../constants";
import { TREND_DATA } from "../data";
import { reportService } from "../../services/reportService";

interface MemberDashboardProps {
  user: User;
  setPage: (p: Page) => void;
}

export default function MemberDashboard({ user, setPage }: MemberDashboardProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const streak = 6;
  const tooltipStyle = styles.tooltipStyle;

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      const data = await reportService.getMyReports();
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  }

  const stats = {
    filed: reports.length,
    thisWeek: reports.filter(r => r.status === "submitted").reduce((sum, r) => sum + (r.hoursWorked || 0), 0),
    completed: reports.reduce((sum, r) => sum + (r.tasksCompleted?.length || 0), 0),
    blockers: reports.reduce((sum, r) => sum + (r.blockers ? 1 : 0), 0)
  };

  return (
    <PageWrap pageKey="member-dash">
      <SectionHeader
        title={`Good morning, ${user.name.split(" ")[0]} 👋`}
        subtitle="Week of Jun 30 – Jul 6, 2026"
        action={<GlowBtn onClick={() => setPage("create-report")}><Plus size={15} /> New Report</GlowBtn>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Reports Filed", value: stats.filed.toString(), sub: "↑ 2 this month", icon: FileText, color: "#4f7bff", glow: "rgba(79,123,255,0.3)" },
          { label: "Hours This Week", value: stats.thisWeek.toFixed(1), sub: "vs 40h target", icon: Clock, color: "#22d3a5", glow: "rgba(34,211,165,0.3)" },
          { label: "Tasks Done", value: stats.completed.toString(), sub: "Across 3 projects", icon: CheckCircle2, color: "#a78bfa", glow: "rgba(167,139,250,0.3)" },
          { label: "Blockers", value: stats.blockers.toString(), sub: "Design assets pending", icon: AlertCircle, color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`${styles.glass} ${styles.glassHover} rounded-2xl p-5 cursor-default`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, boxShadow: `0 0 16px ${s.glow}` }}>
                <s.icon size={17} style={{ color: s.color }} />
              </div>
              <ArrowUpRight size={14} className="text-white/15" />
            </div>
            <div className="font-display font-bold text-[26px] text-white leading-none">{s.value}</div>
            <div className="text-[11px] text-white/40 mt-1">{s.label}</div>
            <div className="text-[11px] font-medium mt-1.5" style={{ color: s.color }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className={`${styles.glass} rounded-2xl p-5 flex flex-col gap-4`}>
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-white text-sm">Your Streak</h2>
            <Flame size={16} style={{ color: "#f59e0b" }} />
          </div>
          <div className="text-center py-2">
            <div className="font-display font-bold text-5xl text-white">{streak}</div>
            <div className="text-xs text-white/40 mt-1">weeks on time</div>
            <div className="flex justify-center gap-1.5 mt-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px]"
                  style={
                    i < streak
                      ? { background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", color: "#f59e0b" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.2)" }
                  }
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-5">
          {[
            { icon: Eye, label: "View Reports", color: "#4f7bff", onClick: () => setPage("reports") },
            { icon: FolderOpen, label: "Manage Projects", color: "#22d3a5", onClick: () => setPage("projects") },
            { icon: TrendingUp, label: "Analytics", color: "#a78bfa", onClick: () => {} },
            { icon: Bot, label: "AI Assistant", color: "#f59e0b", onClick: () => setPage("ai-chat") }
          ].map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 4) * 0.07 }}
              onClick={item.onClick}
              className={`${styles.glass} ${styles.glassHover} rounded-2xl p-4 flex flex-col items-start gap-2 group`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}15` }}>
                <item.icon size={16} style={{ color: item.color }} />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white">{item.label}</div>
                <div className="text-[10px] text-white/30">→</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className={`${styles.glass} rounded-2xl p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white text-sm">Your Trend</h2>
            <TrendingUp size={14} className="text-[#22d3a5]" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TREND_DATA}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3a5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3a5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="week" stroke="rgba(255,255,255,0.2)" />
              <YAxis stroke="rgba(255,255,255,0.2)" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="value" stroke="#22d3a5" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`${styles.glass} rounded-2xl p-5 flex flex-col`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white text-sm">Recent Reports</h2>
            <button onClick={() => setPage("reports")} className="text-[11px] text-[#4f7bff] hover:underline">View all →</button>
          </div>
          <div className="space-y-2 flex-1">
            {reports.slice(0, 3).map((r, i) => (
              <div key={r._id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.05]">
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-white truncate">{r.weekRange}</div>
                  <div className="text-[10px] text-white/40">{r.project?.name || "Unknown"}</div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {reports.length === 0 && (
              <div className="text-center py-8 text-white/40 text-sm">No reports yet</div>
            )}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}
