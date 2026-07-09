import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, Plus, Calendar } from "lucide-react";

import { Page, User } from "../types";
import { PageWrap } from "../components/PageWrap";
import { SectionHeader } from "../components/SectionHeader";
import { GlowBtn } from "../components/GlowBtn";
import { styles } from "../constants";
import { reportService } from "../../services/reportService";
import { projectService } from "../../services/projectService";

interface CreateReportPageProps {
  setPage: (p: Page) => void;
  user: User;
}

export default function CreateReportPage({ setPage, user }: CreateReportPageProps) {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [form, setForm] = useState({
    weekRange: "",
    project: "",
    hoursWorked: "40",
    tasksCompleted: "",
    tasksPlanned: "",
    blockers: "",
    notes: ""
  });

  const steps = ["Details", "Work Done", "Next Steps", "Review"];

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
        if (data.length > 0) {
          setForm(prev => ({ ...prev, project: data[0]._id }));
        }
      } catch (err: any) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  // Set default week range
  useEffect(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    
    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setForm(prev => ({
      ...prev,
      weekRange: `${formatDate(monday)} – ${formatDate(sunday)}`
    }));
  }, []);

  async function submit() {
    if (!form.project || !form.tasksCompleted || !form.tasksPlanned) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const reportData = {
        project: form.project,
        weekRange: form.weekRange,
        hoursWorked: parseInt(form.hoursWorked) || 0,
        tasksCompleted: form.tasksCompleted.split('\n').filter(t => t.trim()),
        tasksPlanned: form.tasksPlanned.split('\n').filter(t => t.trim()),
        blockers: form.blockers,
        notes: form.notes,
        status: "submitted"
      };

      await reportService.createReport(reportData);
      setSaved(true);
      setTimeout(() => setPage("reports"), 1400);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrap pageKey="create-report">
      <SectionHeader
        title="Create Weekly Report"
        subtitle="Takes about 3 minutes to complete."
        action={
          <button
            onClick={() => setPage("reports")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] text-white/40 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-all"
          >
            <X size={13} /> Cancel
          </button>
        }
      />

      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-0 mb-8 max-w-2xl">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => i < step + 1 && setStep(i)}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={
                  i < step
                    ? { background: "#22d3a5", color: "#060d1f" }
                    : i === step
                    ? {
                        background: "linear-gradient(135deg,#4f7bff,#7b5ff8)",
                        color: "#fff",
                        boxShadow: "0 0 14px rgba(79,123,255,0.5)"
                      }
                    : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }
                }
              >
                {i < step ? <CheckCircle2 size={13} /> : i + 1}
              </div>
              <span
                className="text-[12px] hidden sm:block transition-colors"
                style={{
                  color:
                    i === step
                      ? "#fff"
                      : i < step
                      ? "rgba(34,211,165,0.8)"
                      : "rgba(255,255,255,0.25)"
                }}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-px mx-2 transition-all duration-500"
                style={{ background: i < step ? "rgba(34,211,165,0.4)" : "rgba(255,255,255,0.07)" }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`${styles.glass} rounded-2xl p-6 space-y-5`}>
                <div className="text-[11px] font-bold text-[#4f7bff] uppercase tracking-widest">
                  Step 1 — Report Details
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
                      Week Range
                    </label>
                    <div className="relative">
                      <Calendar
                        size={13}
                        className="absolute left-3.5 top-3.5 text-white/25"
                      />
                      <input
                        value={form.weekRange}
                        onChange={e => setForm({ ...form, weekRange: e.target.value })}
                        className={styles.inputCls + " pl-9"}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
                      Project *
                    </label>
                    <select
                      value={form.project}
                      onChange={e => setForm({ ...form, project: e.target.value })}
                      className={styles.inputCls + " cursor-pointer"}
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <option value="">Select a project</option>
                      {projects.map(p => (
                        <option key={p._id} value={p._id} style={{ background: "#0f1c38" }}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
                    Hours Worked
                  </label>
                  <input
                    type="number"
                    value={form.hoursWorked}
                    onChange={e => setForm({ ...form, hoursWorked: e.target.value })}
                    placeholder="e.g. 40"
                    className={styles.inputCls}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`${styles.glass} rounded-2xl p-6 space-y-5`}>
                <div className="text-[11px] font-bold text-[#22d3a5] uppercase tracking-widest">
                  Step 2 — What You Completed
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
                    Tasks Completed *
                  </label>
                  <textarea
                    rows={6}
                    value={form.tasksCompleted}
                    onChange={e => setForm({ ...form, tasksCompleted: e.target.value })}
                    placeholder="One task per line…"
                    className={styles.inputCls + " resize-none leading-relaxed"}
                  />
                  <p className="text-[10px] text-white/20 mt-1">Each new line = one task</p>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
                    Blockers / Challenges
                  </label>
                  <textarea
                    rows={2}
                    value={form.blockers}
                    onChange={e => setForm({ ...form, blockers: e.target.value })}
                    placeholder="Anything blocking progress…"
                    className={styles.inputCls + " resize-none"}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`${styles.glass} rounded-2xl p-6 space-y-5`}>
                <div className="text-[11px] font-bold text-[#a78bfa] uppercase tracking-widest">
                  Step 3 — Next Week Plan
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
                    Tasks Planned *
                  </label>
                  <textarea
                    rows={5}
                    value={form.tasksPlanned}
                    onChange={e => setForm({ ...form, tasksPlanned: e.target.value })}
                    placeholder="One task per line…"
                    className={styles.inputCls + " resize-none leading-relaxed"}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wider">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Context, links, kudos…"
                    className={styles.inputCls + " resize-none"}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`${styles.glass} rounded-2xl overflow-hidden`}>
                <div
                  className="px-6 py-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="text-[11px] font-bold text-white/50 uppercase tracking-widest">
                    Step 4 — Review & Submit
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ["Week", form.weekRange],
                      ["Project", form.project],
                      ["Hours", form.hoursWorked + "h"]
                    ].map(([l, v]) => (
                      <div key={l} className="p-3 rounded-xl bg-white/[0.04]">
                        <div className="text-[10px] text-white/30 mb-1">{l}</div>
                        <div className="text-sm font-medium text-white">{v}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[12px] text-white/40 text-center">
                    Review your report and click submit below
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-2.5 rounded-xl text-[13px] font-medium text-white/40 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] disabled:opacity-30 transition-all"
          >
            ← Back
          </button>
          {step < steps.length - 1 ? (
            <GlowBtn onClick={() => setStep(s => s + 1)}>Continue →</GlowBtn>
          ) : (
            <motion.button
              onClick={submit}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={
                saved
                  ? {
                      background:
                        "linear-gradient(135deg,#22d3a5,#34d399)",
                      boxShadow: "0 8px 24px rgba(34,211,165,0.35)"
                    }
                  : {
                      background:
                        "linear-gradient(135deg,#4f7bff,#7b5ff8)",
                      boxShadow: "0 8px 24px rgba(79,123,255,0.35)"
                    }
              }
            >
              <CheckCircle2 size={15} />
              {loading ? "Submitting…" : saved ? "Submitted! Redirecting…" : "Submit Report"}
            </motion.button>
          )}
        </div>
      </div>
    </PageWrap>
  );
}
