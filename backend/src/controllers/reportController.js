import Report from "../models/Report.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

/* CREATE REPORT */
export const createReport = async (req, res) => {
  try {
    const report = await Report.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json(report);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* GET MY REPORTS */
export const getMyReports = async (req, res) => {

  try {

    const reports = await Report.find({
      user: req.user.id,
    })
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

/* GET ALL REPORTS (Manager) with Filtering */
export const getAllReports = async (req, res) => {

  try {
    const { memberId, projectId, startDate, endDate, status } = req.query;
    let filter = {};

    if (memberId) {
      filter.user = memberId;
    }

    if (projectId) {
      filter.project = projectId;
    }

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.submittedAt = {};
      if (startDate) {
        filter.submittedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.submittedAt.$lte = new Date(endDate);
      }
    }

    const reports = await Report.find(filter)
      .populate("user", "name email department")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    const formattedReports = reports.map(report => ({
      _id: report._id,
      userId: report.user?._id,
      userName: report.user?.name || "",
      projectId: report.project?._id,
      projectName: report.project?.name || "",
      weekRange: report.weekRange,
      tasksCompleted: report.tasksCompleted,
      tasksPlanned: report.tasksPlanned,
      blockers: report.blockers,
      hoursWorked: report.hoursWorked,
      notes: report.notes,
      status: report.status,
      submittedAt: report.submittedAt,
    }));

    return res.json(formattedReports);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

/* UPDATE REPORT */
export const updateReport = async (req, res) => {

  try {

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(report);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

/* DELETE REPORT */
export const deleteReport = async (req, res) => {

  try {

    await Report.findByIdAndDelete(req.params.id);

    res.json({
      message: "Report deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

/* ANALYTICS: Summary Stats */
export const getAnalyticsSummary = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    
    const submittedReports = await Report.countDocuments({ status: "submitted" });
    const submissionRate = totalReports > 0 ? ((submittedReports / totalReports) * 100).toFixed(2) : 0;

    const openBlockers = await Report.countDocuments({ 
      blockers: { $exists: true, $ne: "" } 
    });

    const reportsByWeek = await Report.aggregate([
      {
        $group: {
          _id: "$weekRange",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      },
      {
        $limit: 4
      }
    ]);

    const tasksTrend = reportsByWeek.map(item => ({
      week: item._id,
      count: item.count
    }));

    res.json({
      totalReports,
      submissionRate: parseFloat(submissionRate),
      openBlockers,
      tasksTrend
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ANALYTICS: Reports by Team Member */
export const getAnalyticsByMember = async (req, res) => {
  try {
    const memberAnalytics = await Report.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: "$userInfo"
      },
      {
        $group: {
          _id: "$user",
          name: { $first: "$userInfo.name" },
          email: { $first: "$userInfo.email" },
          department: { $first: "$userInfo.department" },
          totalReports: { $sum: 1 },
          submittedReports: {
            $sum: {
              $cond: [{ $eq: ["$status", "submitted"] }, 1, 0]
            }
          },
          pendingReports: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0]
            }
          },
          lateReports: {
            $sum: {
              $cond: [{ $eq: ["$status", "late"] }, 1, 0]
            }
          },
          totalHours: { $sum: "$hoursWorked" }
        }
      },
      {
        $sort: { totalReports: -1 }
      }
    ]);

    const result = memberAnalytics.map(member => ({
      memberId: member._id,
      name: member.name,
      email: member.email,
      department: member.department,
      totalReports: member.totalReports,
      submittedReports: member.submittedReports,
      pendingReports: member.pendingReports,
      lateReports: member.lateReports,
      submissionRate: member.totalReports > 0 ? 
        ((member.submittedReports / member.totalReports) * 100).toFixed(2) : 0,
      totalHours: member.totalHours
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ANALYTICS: Reports by Project */
export const getAnalyticsByProject = async (req, res) => {
  try {
    const projectAnalytics = await Report.aggregate([
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "projectInfo"
        }
      },
      {
        $unwind: "$projectInfo"
      },
      {
        $group: {
          _id: "$project",
          projectName: { $first: "$projectInfo.name" },
          totalReports: { $sum: 1 },
          submittedReports: {
            $sum: {
              $cond: [{ $eq: ["$status", "submitted"] }, 1, 0]
            }
          },
          pendingReports: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0]
            }
          },
          lateReports: {
            $sum: {
              $cond: [{ $eq: ["$status", "late"] }, 1, 0]
            }
          },
          totalHours: { $sum: "$hoursWorked" },
          avgHoursPerReport: { $avg: "$hoursWorked" }
        }
      },
      {
        $sort: { totalReports: -1 }
      }
    ]);

    const result = projectAnalytics.map(project => ({
      projectId: project._id,
      projectName: project.projectName,
      totalReports: project.totalReports,
      submittedReports: project.submittedReports,
      pendingReports: project.pendingReports,
      lateReports: project.lateReports,
      submissionRate: project.totalReports > 0 ? 
        ((project.submittedReports / project.totalReports) * 100).toFixed(2) : 0,
      totalHours: project.totalHours,
      avgHoursPerReport: project.avgHoursPerReport.toFixed(2)
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ANALYTICS: All Open Blockers */
export const getAnalyticsBlockers = async (req, res) => {
  try {
    const blockers = await Report.find({ 
      blockers: { $exists: true, $ne: "" } 
    })
      .populate("user", "name email department")
      .populate("project", "name")
      .select("blockers user project weekRange status")
      .sort({ createdAt: -1 });

    const result = blockers.map(report => ({
      id: report._id,
      blocker: report.blockers,
      member: report.user.name,
      memberId: report.user._id,
      memberEmail: report.user.email,
      project: report.project.name,
      projectId: report.project._id,
      weekRange: report.weekRange,
      reportStatus: report.status,
      createdAt: report.createdAt
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};