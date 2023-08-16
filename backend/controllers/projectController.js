// @desc Get Projects
// @route GET /api/projects
// @access Private
const getProjects = (req, res) => {
    res.status(200).json({ message: 'Get projects' })
}

// @desc Set Project
// @route POST /api/projects
// @access Private
const setProject = (req, res) => {
    res.status(200).json({ message: 'Set project' })
}

// @desc Update Project
// @route PUT /api/projects/:id
// @access Private
const updateProject = (req, res) => {
    res.status(200).json({ message: `Update goal ${req.params.id}` })
}

// @desc Delete Project
// @route DELETE /api/goals/:id
// @access Private
const deleteProject = (req, res) => {
    res.status(200).json({ message: `Delete goal ${req.params.id}` })
}


module.exports = {
    getProjects,
    setProject,
    updateProject,
    deleteProject
}