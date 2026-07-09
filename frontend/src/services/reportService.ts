import api from "./api";

export const reportService = {
  // Create new report
  createReport: async (reportData) => {
    const response = await api.post("/reports", reportData);
    return response.data;
  },

  // Get user's own reports
  getMyReports: async () => {
    const response = await api.get("/reports/my");
    return response.data;
  },

  // Get all reports (manager only)
  getAllReports: async (filters = {}) => {
    const response = await api.get("/reports", { params: filters });
    return response.data;
  },

  // Get reports with filtering
  getReportsFiltered: async (memberId, projectId, startDate, endDate, status) => {
    const response = await api.get("/reports", {
      params: {
        memberId,
        projectId,
        startDate,
        endDate,
        status
      }
    });
    return response.data;
  },

  // Get analytics summary (manager only)
  getAnalyticsSummary: async () => {
    const response = await api.get("/reports/analytics/summary");
    return response.data;
  },

  // Get reports analytics by member
  getAnalyticsByMember: async () => {
    const response = await api.get("/reports/analytics/by-member");
    return response.data;
  },

  // Get reports analytics by project
  getAnalyticsByProject: async () => {
    const response = await api.get("/reports/analytics/by-project");
    return response.data;
  },

  // Get open blockers
  getBlockers: async () => {
    const response = await api.get("/reports/analytics/blockers");
    return response.data;
  },

  // Update report
  updateReport: async (reportId, reportData) => {
    const response = await api.put(`/reports/${reportId}`, reportData);
    return response.data;
  },

  // Delete report
  deleteReport: async (reportId) => {
    const response = await api.delete(`/reports/${reportId}`);
    return response.data;
  }
};
