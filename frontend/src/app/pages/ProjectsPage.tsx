import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, Users, AlertCircle, Loader2, X, Check, Lock } from "lucide-react";

import { User } from "../types";
import { PageWrap } from "../components/PageWrap";
import { SectionHeader } from "../components/SectionHeader";
import { styles } from "../constants";
import { projectService } from "../../services/projectService";

interface Project {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  memberCount?: number;
  taskCount?: number;
  progress?: number;
  lead?: string;
  dueDate?: string;
  status?: "active" | "completed" | "paused";
  color?: string;
  members?: any[];
}

interface ProjectsPageProps {
  user: User;
}

export default function ProjectsPage({ user }: ProjectsPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    lead: "",
    dueDate: ""
  });

  // Check if user is manager
  const isManager = user?.role === "manager";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data || []);
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch projects:", err);
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    if (!isManager) {
      alert("Only managers can create projects");
      return;
    }
    setFormData({
      name: "",
      description: "",
      category: "",
      lead: "",
      dueDate: ""
    });
    setEditingId(null);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (project: Project) => {
    if (!isManager) {
      alert("Only managers can edit projects");
      return;
    }
    setFormData({
      name: project.name,
      description: project.description || "",
      category: project.category || "",
      lead: project.lead || "",
      dueDate: project.dueDate || ""
    });
    setEditingId(project._id);
    setShowCreateModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await projectService.updateProject(editingId, formData);
      } else {
        await projectService.createProject(formData);
      }
      setShowCreateModal(false);
      await fetchProjects();
    } catch (err: any) {
      console.error("Failed to save project:", err);
      setError(err.response?.data?.message || "Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setSubmitting(true);
      await projectService.deleteProject(id);
      setDeleteConfirm(null);
      await fetchProjects();
    } catch (err: any) {
      console.error("Failed to delete project:", err);
      setError(err.response?.data?.message || "Failed to delete project");
    } finally {
      setSubmitting(false);
    }
  };

  const colors = [
    { bg: "rgba(79,123,255,0.15)", border: "rgba(79,123,255,0.35)", dot: "#4f7bff" },
    { bg: "rgba(34,211,165,0.15)", border: "rgba(34,211,165,0.35)", dot: "#22d3a5" },
    { bg: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.35)", dot: "#a78bfa" },
    { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.35)", dot: "#f59e0b" },
    { bg: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.35)", dot: "#f472b6" },
  ];

  const getColor = (index: number) => colors[index % colors.length];

  return (
    <PageWrap pageKey="projects">
      <SectionHeader
        title="Projects"
        subtitle="Manage team projects and track progress"
        action={
          isManager ? (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] text-white bg-[#4f7bff] hover:bg-[#4f7bff]/90 transition-all"
            >
              <Plus size={14} /> New Project
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] text-white/40 bg-white/[0.04] border border-white/[0.08]">
              <Lock size={14} /> Manager Only
            </div>
          )
        }
      />

      {!isManager && (
        <div className={`${styles.glass} rounded-2xl p-4 mb-6 flex items-center gap-3 border-amber-500/20`}>
          <AlertCircle className="text-amber-400 flex-shrink-0" size={18} />
          <p className="text-amber-300/80 text-sm">Project management is restricted to managers only.</p>
        </div>
      )}

      {error && (
        <div className={`${styles.glass} rounded-2xl p-6 mb-6 flex items-center gap-3`}>
          <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
          <p className="text-white/60">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-white/40" size={32} />
        </div>
      ) : projects.length === 0 ? (
        <div className={`${styles.glass} rounded-2xl p-12 text-center`}>
          <div className="text-white/40 mb-4 text-sm">No projects yet</div>
          {isManager && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4f7bff]/20 text-[#4f7bff] hover:bg-[#4f7bff]/30 transition-all text-sm"
            >
              <Plus size={14} /> Create Your First Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => {
            const color = getColor(i);
            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`${styles.glass} rounded-2xl p-5 hover:bg-white/[0.08] transition-all group relative`}
                style={{
                  background: color.bg,
                  border: `1px solid ${color.border}`
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: color.dot }} />
                      <h3 className="font-semibold text-white text-sm">{project.name}</h3>
                    </div>
                    {project.category && (
                      <p className="text-[11px] text-white/40">{project.category}</p>
                    )}
                  </div>
                  {isManager && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(project)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.1] text-white/60 hover:text-white transition-colors"
                        title="Edit project"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(project._id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {project.description && (
                  <p className="text-[12px] text-white/50 mb-3 line-clamp-2">{project.description}</p>
                )}

                {project.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-white/40">Progress</span>
                      <span className="text-[11px] font-mono text-white/60">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-white/[0.08] rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${project.progress}%`,
                          background: color.dot
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {project.memberCount !== undefined && (
                    <div className="bg-white/[0.04] rounded-lg p-2">
                      <div className="text-[11px] text-white/40">Members</div>
                      <div className="text-[14px] font-semibold text-white">
                        {project.memberCount}
                      </div>
                    </div>
                  )}
                  {project.taskCount !== undefined && (
                    <div className="bg-white/[0.04] rounded-lg p-2">
                      <div className="text-[11px] text-white/40">Tasks</div>
                      <div className="text-[14px] font-semibold text-white">
                        {project.taskCount}
                      </div>
                    </div>
                  )}
                </div>

                {(project.lead || project.dueDate) && (
                  <div className="space-y-1 text-[11px] text-white/40 pt-3 border-t border-white/[0.08]">
                    {project.lead && <div><span className="text-white/60">Lead:</span> {project.lead}</div>}
                    {project.dueDate && <div><span className="text-white/60">Due:</span> {project.dueDate}</div>}
                  </div>
                )}

                {deleteConfirm === project._id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center p-4"
                  >
                    <div className={`${styles.glass} rounded-xl p-4 text-center`}>
                      <p className="text-white text-sm mb-3">Delete "{project.name}"?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white/60 text-sm transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          disabled={submitting}
                          className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-all"
                        >
                          {submitting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showCreateModal && isManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => !submitting && setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`${styles.glass} rounded-2xl p-6 max-w-md w-full`}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-lg text-white">
                  {editingId ? "Edit Project" : "New Project"}
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={submitting}
                  className="text-white/40 hover:text-white/60 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-[12px] text-white/60 mb-1.5 font-medium">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Client Portal"
                    className={`${styles.inputCls} text-sm`}
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-white/60 mb-1.5 font-medium">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Project description..."
                    className={`${styles.inputCls} text-sm resize-none h-20`}
                    disabled={submitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] text-white/60 mb-1.5 font-medium">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Product"
                      className={`${styles.inputCls} text-sm`}
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-white/60 mb-1.5 font-medium">
                      Project Lead
                    </label>
                    <input
                      type="text"
                      value={formData.lead}
                      onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                      placeholder="Lead name"
                      className={`${styles.inputCls} text-sm`}
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] text-white/60 mb-1.5 font-medium">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className={`${styles.inputCls} text-sm`}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white/60 text-sm font-medium transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#4f7bff] hover:bg-[#4f7bff]/90 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      {editingId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      {editingId ? "Update" : "Create"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrap>
  );
}