import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleMiddleware.js";

import {
    createProject,
    getProjects,
    updateProject,
    deleteProject
} from "../controllers/projectController.js";

const router = express.Router();

// Anyone can view projects
router.get("/", authMiddleware, getProjects);

// Only managers can create projects
router.post("/", authMiddleware, requireRole("manager"), createProject);

// Only managers can update projects
router.put("/:id", authMiddleware, requireRole("manager"), updateProject);

// Only managers can delete projects
router.delete("/:id", authMiddleware, requireRole("manager"), deleteProject);

export default router;