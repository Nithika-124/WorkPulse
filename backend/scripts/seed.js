import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../src/models/User.js";
import Project from "../src/models/Project.js";
import Report from "../src/models/Report.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Report.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create sample users
    const hashedPasswordManager = await bcrypt.hash("manager123", 10);
    const hashedPasswordMember = await bcrypt.hash("member123", 10);

    const manager = await User.create({
      name: "Alice Johnson",
      email: "alice@company.io",
      password: hashedPasswordManager,
      role: "manager",
      department: "Engineering"
    });
    console.log("👤 Manager created:", manager.name);

    const members = await User.create([
      {
        name: "Nadia Okafor",
        email: "nadia@company.io",
        password: hashedPasswordMember,
        role: "member",
        department: "Frontend"
      },
      {
        name: "Marcus Chen",
        email: "marcus@company.io",
        password: hashedPasswordMember,
        role: "member",
        department: "Backend"
      },
      {
        name: "Sofia Reyes",
        email: "sofia@company.io",
        password: hashedPasswordMember,
        role: "member",
        department: "R&D"
      }
    ]);
    console.log("👥 Team members created:", members.map(m => m.name).join(", "));

    // Create sample projects
    const projects = await Project.create([
      {
        name: "Client Portal",
        description: "Main client-facing web application",
        category: "Product",
        members: [manager._id, members[0]._id, members[1]._id]
      },
      {
        name: "Internal Tooling",
        description: "Backend infrastructure and internal tools",
        category: "Infrastructure",
        members: [manager._id, members[1]._id]
      },
      {
        name: "R&D - AI Features",
        description: "Research and development for AI capabilities",
        category: "Research",
        members: [manager._id, members[2]._id]
      },
      {
        name: "Marketing Website",
        description: "Marketing and company website",
        category: "Marketing",
        members: [manager._id, members[0]._id]
      }
    ]);
    console.log("📁 Projects created:", projects.map(p => p.name).join(", "));

    // Create sample reports
    const reports = await Report.create([
      {
        user: members[0]._id,
        project: projects[0]._id,
        weekRange: "Jun 30 – Jul 6, 2026",
        tasksCompleted: [
          "Redesigned login flow",
          "Fixed API authentication bug",
          "Reviewed 4 pull requests",
          "Updated component library"
        ],
        tasksPlanned: [
          "Implement 2FA",
          "Dashboard v2 prototype",
          "Write unit tests"
        ],
        blockers: "Waiting on design assets from brand team",
        hoursWorked: 42,
        notes: "Good sprint overall, team velocity improving.",
        status: "submitted"
      },
      {
        user: members[1]._id,
        project: projects[1]._id,
        weekRange: "Jun 30 – Jul 6, 2026",
        tasksCompleted: [
          "CI/CD pipeline upgrade",
          "Linting config overhaul",
          "Migrated legacy scripts"
        ],
        tasksPlanned: ["Deploy staging env", "Write integration tests"],
        blockers: "",
        hoursWorked: 38,
        notes: "Pipeline is now 40% faster.",
        status: "submitted"
      },
      {
        user: members[2]._id,
        project: projects[2]._id,
        weekRange: "Jun 30 – Jul 6, 2026",
        tasksCompleted: [
          "Trained ML model v2",
          "Optimized inference speed by 25%",
          "Documented model architecture"
        ],
        tasksPlanned: [
          "Integration with main app",
          "Performance benchmarking"
        ],
        blockers: "Need GPU resources for large dataset training",
        hoursWorked: 45,
        notes: "Model accuracy improved to 94%. Ready for beta testing.",
        status: "submitted"
      }
    ]);
    console.log("📊 Sample reports created:", reports.length);

    console.log("\n✅ Database seeded successfully!\n");
    console.log("Sample Login Credentials:");
    console.log("  Manager: alice@company.io / manager123");
    console.log("  Member: nadia@company.io / member123");
    console.log("  Member: marcus@company.io / member123");
    console.log("  Member: sofia@company.io / member123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
