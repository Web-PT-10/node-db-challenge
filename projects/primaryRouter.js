const express = require('express');
const dataBase = require('../data/knex-config');
const db = require('../projects/project-model');
const router = express.Router();

router.get('/', (req, res, next) => {
	try {
		res.status(200).json({
			message: `welcome to the API. What would you like PROJECTS? RESOURCES? TASKS? /api/projects /api/resources /api/projects/:id/tasks /api/projects/:id/resources`
		});
	} catch (err) {
		next(err);
	}
});
//PROJECT CRUD OPERATIONS -- MISSING UPDATE
router.get('/projects', async (req, res, next) => {
	try {
		const data = await db.getProjects();
		res.status(200).json(data);
	} catch (err) {
		next(err);
	}
});

//SPECIAL STRETCH PROJECT ROUTE
router.get('/projects/:id', async (req, res, next) => {
	try {
		const data = await db.getProjectWithTasksResource(req.params.id);
		res.status(200).json(data);
	} catch (err) {
		next(err);
	}
});

router.post('/projects', async (req, res, next) => {
	const newProject = req.body;
	try {
		await db.addProject(newProject);
		res.status(201).json(newProject);
	} catch (err) {
		next(err);
	}
});

router.put('/projects/:id', validateProjectId, async (req, res, next) => {
	try {
		const updatedProject = await db.updateProject(req.body, req.params.id);
		res.status(201).json(updatedProject);
	} catch (err) {
		next(err);
	}
});

router.delete('/projects/:id', validateProjectId, async (req, res, next) => {
	try {
		await db.removeProject(req.params.id);
		res.status(200).json({ message: 'Project Removed' });
	} catch (err) {
		next(err);
	}
});

//RESOURCES CRUD OPERATION
router.get('/resources', async (req, res, next) => {
	try {
		const data = await db.getAllResources();
		res.status(200).json(data);
	} catch (err) {
		next(err);
	}
});

router.post('projects/:id/resources', async (req, res, next) => {
	const newResource = req.body;
	try {
		await db.addResource(newResource);
		res.status(201).json(newResource);
	} catch (err) {
		next(err);
	}
});

router.put('/projects/:id/resources', async (req, res, next) => {
	try {
		const updatedResource = await db.updateResource(req.body, req.params.id);
		res.status(201).json(updatedResource);
	} catch (err) {
		next(err);
	}
});

router.delete('/projects/:id/resources/:id', validateResourceId, async (req, res, next) => {
	try {
		await db.removeResource(req.params.id);
		res.status(200).json({ message: 'Resource Removed' });
	} catch (err) {
		next(err);
	}
});

//TASKS CRUD OPERATIONS
router.get('/tasks', async (req, res, next) => {
	try {
		const data = await db.getTasks();
		res.status(200).json(data);
	} catch (err) {
		next(err);
	}
});

router.get('/projects/:id/tasks', validateProjectId, async (req, res, next) => {
	try {
		const data = await db.getTasks(req.params.id);
		res.status(200).json(data);
	} catch (err) {
		next(err);
	}
});

router.post('/projects/:id/tasks', validateProjectId, async (req, res, next) => {
	const { id } = req.params;
	const newTask = { ...req.body, project_id: id };
	try {
		await db.addTask(newTask);
		res.status(201).json(newTask);
	} catch (err) {
		next(err);
	}
});

router.put('/tasks/:id', validateTaskId, async (req, res, next) => {
	try {
		const updatedTask = await db.updateTask(req.body, req.params.id);
		res.status(201).json(updatedTask);
	} catch (err) {
		next(err);
	}
});

router.delete('tasks/:id', validateTaskId, async (req, res, next) => {
	try {
		await db.removeTask(req.params.id);
		res.status(200).json({ message: 'Task Removed' });
	} catch (err) {
		next(err);
	}
});

//MIDDLE WARE FOR VALIDATION OF ID
//Validate Project & ID
async function validateProjectId(req, res, next) {
	const project = await dataBase('projects').where('id', parseInt(req.params.id));
	if (!project[0]) {
		res.status(404).json({ message: 'Invalid project Id' });
	}
	else {
		next();
	}
}

//Validate Resource ID
async function validateResourceId(req, res, next) {
	const resource = await dataBase('resources').where('id', parseInt(req.params.id));
	if (!resource[0]) {
		res.status(404).json({ message: 'Invalid resource Id' });
	}
	else {
		next();
	}
}

//Validate Tasks ID
async function validateTaskId(req, res, next) {
	const task = await dataBase('tasks').where('id', parseInt(req.params.id));
	if (!task[0]) {
		res.status(404).json({ message: 'Invalid resource Id' });
	}
	else {
		next();
	}
}

module.exports = router;
