import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    weekRange: {
      type: String,
      required: true,
    },

    tasksCompleted: [
      {
        type: String,
      },
    ],

    tasksPlanned: [
      {
        type: String,
      },
    ],

    blockers: {
      type: String,
      default: "",
    },

    hoursWorked: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["submitted", "pending", "late"],
      default: "submitted",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Report", reportSchema);