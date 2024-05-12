// @desc Get Projects
// @route GET /api/projects
// @access Private
export const getProjects = (req:any, res:any) => {
    res.status(200).json({ message: 'Get projects' })
}

// @desc Set Project
// @route POST /api/projects
// @access Private
export const setProject = (req:any, res:any) => {
    res.status(200).json({ message: 'Set project' })
}

// @desc Update Project
// @route PUT /api/projects/:id
// @access Private
export const updateProject = (req:any, res:any) => {
    res.status(200).json({ message: `Update goal ${req.params.id}` })
}

// @desc Delete Project
// @route DELETE /api/goals/:id
// @access Private
export const deleteProject = (req:any, res:any) => {
    res.status(200).json({ message: `Delete goal ${req.params.id}` })
}


module.exports = {
    getProjects,
    setProject,
    updateProject,
    deleteProject
}