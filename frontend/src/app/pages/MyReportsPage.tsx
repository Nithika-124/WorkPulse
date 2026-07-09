import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ChevronDown, Pencil, Trash2, CheckCircle2, Target, Tag, Clock, Calendar } from "lucide-react";

import { Page, User } from "../types";
import { PageWrap } from "../components/PageWrap";
import { SectionHeader } from "../components/SectionHeader";
import { GlowBtn } from "../components/GlowBtn";
import { StatusBadge } from "../components/StatusBadge";
import { styles } from "../constants";
import { reportService } from "../../services/reportService";

interface MyReportsPageProps {
  setPage: (p: Page) => void;
  user: User;
}

export default function MyReportsPage({ setPage, user }: MyReportsPageProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    try {
      setLoading(true);
      const data = await reportService.getMyReports();
      setReports(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }

  async function deleteReport(id: string) {
    if (!confirm("Are you sure you want to delete this report?")) return;
    
    try {
      await reportService.deleteReport(id);
      setReports(reports.filter(r => r._id !== id));
    } catch (err: any) {
      setError("Failed to delete report");
    }
  }

  const stats = {
    total: reports.length,
    submitted: reports.filter(r => r.status === "submitted").length,
    pending: reports.filter(r => r.status === "pending").length,
    late: reports.filter(r => r.status === "late").length,
    avgHours: reports.length > 0 ? (reports.reduce((sum, r) => sum + (r.hoursWorked || 0), 0) / reports.length).toFixed(1) : "0"
  };

  return (
    <PageWrap pageKey="my-reports">
      <SectionHeader
        title="My Reports"
        subtitle="Full history of your weekly submissions."
        action={<GlowBtn onClick={() => setPage("create-report")}><Plus size={15} /> New Report</GlowBtn>}
      />

      <div className="grid grid-cols-4 gap-3 mb-7">
        {[
          [stats.total, "Total Submitted", "#4f7bff"],
          [stats.pending, "Pending", "#f59e0b"],
          [stats.late, "Late", "#ff5370"],
          [stats.avgHours + "h", "Avg / Week", "#22d3a5"]
        ].map(([v, l, c]) => (
          <div key={l} className={`${styles.glass} rounded-xl px-4 py-3 flex items-center gap-3`}>
            <div className="font-display font-bold text-xl text-white">{v}</div>
            <div className="text-[11px] text-white/40 leading-tight">{l}</div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-white/40">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-12 text-white/40">No reports yet. Create your first report!</div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-white/[0.06]" />
          <div className="space-y-4 pl-12">
            {reports.map((r, i) => {
              const open = expanded === r._id;
              return (
                <div key={r._id} className="relative">
                  <div
                    className="absolute -left-[35px] top-5 w-2.5 h-2.5 rounded-full ring-2 ring-[#060d1f]"
                    style={{
                      background:
                        r.status === "submitted"
                          ? "#22d3a5"
                          : r.status === "pending"
                          ? "#f59e0b"
                          : "#ff5370"
                    }}
                  />

                  <motion.div
                    layout
                    className={`${styles.glass} rounded-2xl overflow-hidden cursor-pointer ${styles.glassHover}`}
                    onClick={() => setExpanded(open ? null : r._id)}
                  >
                    <div className="px-5 py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-display font-semibold text-white text-[13px]">{r.weekRange}</span>
                            <StatusBadge status={r.status} />
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-white/30">
                            <span className="flex items-center gap-1">
                              <Tag size={9} />
                              {r.project?.name || "Unknown"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={9} />
                              {r.hoursWorked || 0}h
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronDown
                        size={17}
                        className="text-white/20 transition-transform"
                        style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </div>

                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-white/[0.05]"
                        >
                          <div className="px-5 py-4 space-y-4">
                            <div>
                              <div className="text-[10px] font-bold text-white/40 mb-2 uppercase tracking-wider">Tasks Completed</div>
                              <ul className="space-y-1">
                                {r.tasksCompleted?.map((t: string, i: number) => (
                                  <li key={i} className="text-[12px] text-white/60 flex items-start gap-2">
                                    <CheckCircle2 size={12} className="text-[#22d3a5] mt-0.5 flex-shrink-0" />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <div className="text-[10px] font-bold text-white/40 mb-2 uppercase tracking-wider">Tasks Planned</div>
                              <ul className="space-y-1">
                                {r.tasksPlanned?.map((t: string, i: number) => (
                                  <li key={i} className="text-[12px] text-white/60 flex items-start gap-2">
                                    <Target size={12} className="text-[#4f7bff] mt-0.5 flex-shrink-0" />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {r.blockers && (
                              <div>
                                <div className="text-[10px] font-bold text-white/40 mb-1 uppercase tracking-wider">Blockers</div>
                                <p className="text-[12px] text-white/60">{r.blockers}</p>
                              </div>
                            )}

                            {r.notes && (
                              <div>
                                <div className="text-[10px] font-bold text-white/40 mb-1 uppercase tracking-wider">Notes</div>
                                <p className="text-[12px] text-white/60">{r.notes}</p>
                              </div>
                            )}

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // TODO: Implement edit
                                }}
                                className="flex-1 px-3 py-2 rounded-lg text-[11px] text-white/60 bg-white/[0.05] hover:bg-white/[0.08] transition-all flex items-center justify-center gap-1"
                              >
                                <Pencil size={11} /> Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteReport(r._id);
                                }}
                                className="flex-1 px-3 py-2 rounded-lg text-[11px] text-red-400/60 bg-red-500/[0.05] hover:bg-red-500/[0.08] transition-all flex items-center justify-center gap-1"
                              >
                                <Trash2 size={11} /> Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PageWrap>
  );
}
