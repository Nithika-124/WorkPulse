import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, Filter, CheckCircle2, Target, AlertCircle, Loader2, Search } from "lucide-react";

import { User } from "../types";
import { PageWrap } from "../components/PageWrap";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { Avatar } from "../components/Avatar";
import { styles } from "../constants";
import { reportService } from "../../services/reportService";
import { projectService } from "../../services/projectService";

interface ReportData {
  _id: string;

  user: {
    _id: string;
    name: string;
    email: string;
    department: string;
  };

  project: {
    _id: string;
    name: string;
  };

  weekRange: string;

  tasksCompleted: string[];

  tasksPlanned: string[];

  blockers: string;

  hoursWorked: number;

  notes: string;

  status: "submitted" | "pending" | "late";

  submittedAt: string;

  createdAt?: string;

  updatedAt?: string;
}

interface TeamReportsPageProps {
  user: User;
}

export default function TeamReportsPage({ user }: TeamReportsPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportsData, projectsData] = await Promise.all([
          reportService.getAllReports(),
          projectService.getProjects()
        ]);
        console.log("REPORTS DATA");
        console.log(reportsData);

        console.log("FIRST REPORT");
        console.log(reportsData[0]);
        setReports(reportsData || []);
        setProjects(projectsData || []);
        setError("");
      } catch (err: any) {
        console.error("Failed to fetch reports:", err);
        setError("Failed to load team reports");
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedReport = selected ? reports.find(r => r._id === selected) : null;

  const filteredReports = reports.filter(r => {
    const matchesSearch = !searchTerm || r.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = !selectedProject || r.project._id === selectedProject;
    const matchesStatus = !selectedStatus || r.status === selectedStatus;
    return matchesSearch && matchesProject && matchesStatus;
  });

  return (
    <PageWrap pageKey="team-reports">
      <SectionHeader
        title="Team Reports"
        subtitle={`All team submissions · ${new Date().toLocaleDateString()}`}
        action={
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[12px] text-white/40 flex items-center gap-1.5 hover:bg-white/[0.08] transition-all">
              <Download size={12} /> Export
            </button>
          </div>
        }
      />

      {error && !loading && (
        <div className={`${styles.glass} rounded-2xl p-6 mb-6 flex items-center gap-3`}>
          <AlertCircle className="text-red-400" size={20} />
          <p className="text-white/60">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${styles.inputCls} pl-9 text-[13px]`}
              />
            </div>

            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className={`${styles.inputCls} text-[13px]`}
            >
              <option value="">All Projects</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`${styles.inputCls} text-[13px]`}
            >
              <option value="">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="pending">Pending</option>
              <option value="late">Late</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-white/40" size={24} />
            </div>
          ) : filteredReports.length === 0 ? (
            <div className={`${styles.glass} rounded-2xl p-6 text-center text-white/40`}>
              <p className="text-sm">No reports found</p>
            </div>
          ) : (
            filteredReports.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setSelected(selected === r._id ? null : r._id)}
                className={`rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                  selected === r._id ? "border" : `${styles.glass} ${styles.glassHover}`
                }`}
                style={
                  selected === r._id
                    ? {
                        background:
                          "linear-gradient(135deg,rgba(79,123,255,0.15),rgba(123,95,248,0.1))",
                        border: "1px solid rgba(79,123,255,0.35)",
                        boxShadow: "0 0 24px rgba(79,123,255,0.12)"
                      }
                    : {}
                }
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={r.user.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-white truncate">{r.user.name}</div>
                    <div className="text-[11px] text-white/35 truncate">{r.project.name || r.project._id}</div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: r.hoursWorked > 0 ? `${r.hoursWorked}h` : "—", l: "Hours" },
                    { v: r.tasksCompleted?.length || "—", l: "Done" },
                    { v: r.blockers ? "Yes" : "None", l: "Blocker" }
                  ].map(({ v, l }) => (
                    <div key={l} className="bg-white/[0.04] rounded-lg p-2 text-center">
                      <div className="text-[13px] font-semibold text-white">{v}</div>
                      <div className="text-[10px] text-white/30">{l}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.div
                key={selectedReport._id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                className={`${styles.glass} rounded-2xl overflow-hidden`}
                style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.35)" }}
              >
                <div
                  className="px-6 py-5 flex items-center gap-4"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background:
                      "linear-gradient(135deg,rgba(79,123,255,0.08),rgba(123,95,248,0.05))"
                  }}
                >
                  <Avatar name={selectedReport.user.name} size="lg" />
                  <div className="flex-1">
                    <div className="font-display font-bold text-lg text-white">
                      {selectedReport.user.name}
                    </div>
                    <div className="text-[12px] text-white/40 mt-0.5">
                      {selectedReport.weekRange} · {selectedReport.project.name || selectedReport.project._id}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge status={selectedReport.status} />
                      {selectedReport.submittedAt && (
                        <span className="text-[11px] text-white/30">
                          Submitted {selectedReport.submittedAt}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-3xl text-white">
                      {selectedReport.hoursWorked > 0 ? selectedReport.hoursWorked + "h" : "—"}
                    </div>
                    <div className="text-[11px] text-white/30">hours logged</div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                        Completed ({selectedReport.tasksCompleted?.length || 0})
                      </span>
                    </div>
                    {selectedReport.tasksCompleted?.length ? (
                      <div className="space-y-1.5">
                        {selectedReport.tasksCompleted.map((t, idx) => (
                          <motion.div
                            key={t}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.03]"
                          >
                            <span className="text-[11px] font-mono text-white/25 mt-0.5 w-4 flex-shrink-0">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[13px] text-white/70">{t}</span>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[12px] text-white/25 italic">No tasks submitted</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target size={13} style={{ color: "#4f7bff" }} />
                      <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                        Planned Next ({selectedReport.tasksPlanned?.length || 0})
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {selectedReport.tasksPlanned?.length ? (
                        selectedReport.tasksPlanned.map((t, idx) => (
                          <div
                            key={t}
                            className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.03]"
                          >
                            <span className="text-[11px] font-mono text-white/25 mt-0.5 w-4 flex-shrink-0">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[13px] text-white/70">{t}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[12px] text-white/25 italic">No tasks planned</p>
                      )}
                    </div>
                  </div>

                  {selectedReport.blockers && (
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background: "rgba(255,83,112,0.07)",
                        border: "1px solid rgba(255,83,112,0.18)"
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-[11px] font-bold text-red-400 mb-1">BLOCKER</div>
                          <div className="text-[13px] text-red-300/80">{selectedReport.blockers}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedReport.notes && (
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background: "rgba(79,123,255,0.06)",
                        border: "1px solid rgba(79,123,255,0.15)"
                      }}
                    >
                      <div className="text-[11px] font-bold text-blue-300 mb-2">NOTES</div>
                      <div className="text-[13px] text-white/60">{selectedReport.notes}</div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className={`${styles.glass} rounded-2xl p-12 text-center`}>
                <div className="text-white/40 text-sm">Select a team member to view their report</div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrap>
  );
}
