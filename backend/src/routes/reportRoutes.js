import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

import {
  createReport,
  getMyReports,
  getAllReports,
  updateReport,
  deleteReport,
  getAnalyticsSummary,
  getAnalyticsByMember,
  getAnalyticsByProject,
  getAnalyticsBlockers,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/", authMiddleware, createReport);

router.get("/my", authMiddleware, getMyReports);

router.get("/analytics/summary", authMiddleware, requireRole("manager"), getAnalyticsSummary);

router.get("/analytics/by-member", authMiddleware, requireRole("manager"), getAnalyticsByMember);

router.get("/analytics/by-project", authMiddleware, requireRole("manager"), getAnalyticsByProject);

router.get("/analytics/blockers", authMiddleware, requireRole("manager"), getAnalyticsBlockers);

router.get("/", authMiddleware, requireRole("manager"), getAllReports);

router.put("/:id", authMiddleware, updateReport);

router.delete("/:id", authMiddleware, deleteReport);

export default router;