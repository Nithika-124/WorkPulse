import Project from "../models/Project.js";

/* CREATE PROJECT */
export const createProject = async (req, res) => {

    try {

        const project = await Project.create(req.body);

        res.status(201).json(project);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* GET ALL PROJECTS */
export const getProjects = async (req, res) => {

    try {

        const projects = await Project.find().populate(
            "members",
            "name email"
        );

        res.json(projects);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* UPDATE PROJECT */
export const updateProject = async (req, res) => {

    try {

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );

        res.json(project);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

/* DELETE PROJECT */
export const deleteProject = async (req, res) => {

    try {

        await Project.findByIdAndDelete(req.params.id);

        res.json({
            message: "Project deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};