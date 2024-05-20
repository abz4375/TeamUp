const express = require('express')  
const router = express.Router()
const {getProjects,setProject,updateProject,deleteProject} = require('../controllers/projectController')

router.route('/').get(getProjects).post(setProject)
router.route('/:id').delete(deleteProject).put(updateProject)


module.exports = router 