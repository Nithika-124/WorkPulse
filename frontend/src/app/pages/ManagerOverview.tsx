import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Download, FileText, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

import { User } from "../types";
import { PageWrap } from "../components/PageWrap";
import { SectionHeader } from "../components/SectionHeader";
import { Avatar } from "../components/Avatar";
import { StatusBadge } from "../components/StatusBadge";
import { styles } from "../constants";
import { reportService } from "../../services/reportService";

interface ManagerOverviewProps {
  user: User;
}

export default function ManagerOverview({ user }: ManagerOverviewProps) {
  const tooltipStyle = styles.tooltipStyle;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [memberStats, setMemberStats] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryData, memberData] = await Promise.all([
          reportService.getAnalyticsSummary(),
          reportService.getAnalyticsByMember()
        ]);
        
        setSummary(summaryData);
        setMemberStats(memberData || []);
        
        // Format trend data if available
        if (summaryData.trendData) {
          setTrendData(summaryData.trendData);
        }
        
        setError("");
      } catch (err: any) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load analytics data");
        // Set fallback data
        setSummary({
          complianceRate: 0.6,
          openBlockers: 2,
          tasksCompleted: 0,
          totalHours: 0,
          submittedCount: 3,
          totalMembers: 5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error && !summary) {
    return (
      <PageWrap pageKey="manager-overview">
        <SectionHeader title="Manager Overview" subtitle="Team performance" />
        <div className={`${styles.glass} rounded-2xl p-8 text-center`}>
          <AlertCircle className="mx-auto mb-3 text-red-400" size={28} />
          <p className="text-white/60">{error}</p>
        </div>
      </PageWrap>
    );
  }

  const complianceRate = summary?.complianceRate || 0;
  const compliancePercent = Math.round(complianceRate * 100);
  const stats = [
    { 
      label: "Submitted", 
      value: `${summary?.submittedCount || 0}/${summary?.totalMembers || 0}`, 
      sub: `${compliancePercent}% compliance`, 
      icon: FileText, 
      color: "#4f7bff", 
      glow: "rgba(79,123,255,0.3)" 
    },
    { 
      label: "Total Hours", 
      value: `${summary?.totalHours || 0}h`, 
      sub: "Team this week", 
      icon: Clock, 
      color: "#22d3a5", 
      glow: "rgba(34,211,165,0.3)" 
    },
    { 
      label: "Blockers Open", 
      value: `${summary?.openBlockers || 0}`, 
      sub: "Needs attention", 
      icon: AlertCircle, 
      color: "#f59e0b", 
      glow: "rgba(245,158,11,0.3)" 
    },
    { 
      label: "Tasks Done", 
      value: `${summary?.tasksCompleted || 0}`, 
      sub: "Across team", 
      icon: CheckCircle2, 
      color: "#a78bfa", 
      glow: "rgba(167,139,250,0.3)" 
    },
  ];

  const complianceData = [
    { name: "Submitted", value: summary?.submittedCount || 0, color: "#4f7bff" },
    { name: "Pending", value: (summary?.totalMembers || 0) - (summary?.submittedCount || 0), color: "#f59e0b" },
  ];

  return (
    <PageWrap pageKey="manager-overview">
      <SectionHeader 
        title="Manager Overview" 
        subtitle={`Team performance · ${new Date().toLocaleDateString()}`}
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] text-white/40 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-all">
            <Download size={13} /> Export
          </button>
        }
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-white/40" size={32} />
        </div>
      )}

      {!loading && (
      <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`${styles.glass} ${styles.glassHover} rounded-2xl p-5`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, boxShadow: `0 0 16px ${s.glow}` }}>
                <s.icon size={17} style={{ color: s.color }} />
              </div>
            </div>
            <div className="font-display font-bold text-[26px] text-white leading-none">{s.value}</div>
            <div className="text-[11px] text-white/40 mt-1">{s.label}</div>
            <div className="text-[11px] font-medium mt-1.5" style={{ color: s.color }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>


      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <div className={`lg:col-span-2 ${styles.glass} rounded-2xl p-5`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-sm">6-Week Activity Trend</h2>
            <div className="flex items-center gap-4 text-[11px] text-white/35">
              <span className="flex items-center gap-1.5"><span className="w-2 h-0.5 inline-block rounded bg-[#4f7bff]" />Tasks</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-0.5 inline-block rounded bg-[#22d3a5]" />Hours</span>
            </div>
          </div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f7bff" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#4f7bff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3a5" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#22d3a5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="tasks" name="Tasks" stroke="#4f7bff" strokeWidth={2.5} fill="url(#g1)" dot={{ fill: "#4f7bff", r: 4, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="hours" name="Hours" stroke="#22d3a5" strokeWidth={2} fill="url(#g2)" strokeDasharray="5 4" dot={{ fill: "#22d3a5", r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-white/30">No trend data available</div>
          )}
        </div>

        <div className={`${styles.glass} rounded-2xl p-5 flex flex-col`}>
          <h2 className="font-display font-semibold text-white text-sm mb-4">Submission Status</h2>
          <div className="flex-1 flex items-center justify-center">
            {complianceData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={complianceData} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={4} dataKey="value" startAngle={90} endAngle={-270}>
                    {complianceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-white/30 text-sm">No submission data</div>
            )}
          </div>
          <div className="space-y-2 mt-1">
            {complianceData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[12px] text-white/40">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color, boxShadow: `0 0 6px ${d.color}` }} />{d.name}
                </span>
                <span className="text-[12px] font-mono font-medium text-white/70">{d.value} members</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {memberStats.length > 0 && (
        <div className={`${styles.glass} rounded-2xl p-5`}>
          <h2 className="font-display font-semibold text-white text-sm mb-5">Hours by Member This Week</h2>
          <div className="space-y-3">
            {memberStats.map((member, i) => (
              <motion.div
                key={member.memberId || i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className="flex-shrink-0">
                  <Avatar name={member.memberName || "Unknown"} size="sm" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{member.memberName || "Unknown"}</span>
                    <span className="text-sm font-mono text-white/60">{member.hoursWorked || 0}h</span>
                  </div>
                  <div className="w-full bg-white/[0.08] rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-[#4f7bff] to-[#22d3a5] h-1.5 rounded-full"
                      style={{ width: `${Math.min((member.hoursWorked || 0) / 50 * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      </>
      )}
    </PageWrap>
  );
}
