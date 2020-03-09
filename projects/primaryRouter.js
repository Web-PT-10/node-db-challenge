const express = require('express');
const db = require('../projects/project-model');
const router = express.Router();

router.get('/', (req, res, next) => {
	try {
		res.status(200).json({
			message:
				'welcome to the API. What would you like PROJECTS? RESOURCES? TASKS?. Post new data, Update data, or delete data using these endpoints: /api/projects /api/resources or /api/projects/:id/tasks'
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

router.get('/projects/:id', async (req, res, next) => {
	try {
		const data = await db.getProjectsById(req.params.id);
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

router.put('/projects/:id', async (req, res, next) => {
	try {
		const updatedProject = {
			id: req.params.id,
			name: req.body,
			description: req.body
		};
		await db.updateProject(updatedProject);
		res.status(201).json(updatedProject);
	} catch (err) {
		next(err);
	}
});

router.delete('/projects/:id', async (req, res, next) => {
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
		const data = await db.getResources();
		res.status(200).json(data);
		console.log('TEST');
	} catch (err) {
		next(err);
	}
});

router.post('/resources', async (req, res, next) => {
	try {
		const newResource = req.body;
		await db.addResource(newResource);
		res.status(201).json(newResource);
	} catch (err) {
		next(err);
	}
});

router.put('/resources/:resource_id', async (req, res, next) => {
	try {
		const updatedResource = {
			id: req.params.resource_id,
			name: req.body,
			description: req.body
		};
		await db.updateProject(updatedResource);
		res.status(201).json(updatedResource);
	} catch (err) {
		next(err);
	}
});

router.delete('/resources/:id', async (req, res, next) => {
	try {
		await db.removeResource(req.params.id);
		res.status(200).json({ message: 'Resource Removed' });
	} catch (err) {
		next(err);
	}
});

//TASKS CRUD OPERATIONS

router.get('/projects/:id/tasks', async (req, res, next) => {
	try {
		const data = await db.getTasks(req.params.id);
		res.status(200).json(data);
	} catch (err) {
		next(err);
	}
});

router.post('/projects/:id/tasks', async (req, res, next) => {
	try {
		const newTask = req.body;
		await db.addTask(newTask);
		res.status(201).json(newTask);
	} catch (err) {
		next(err);
	}
});

router.put('/projects/:id/tasks/:task_id', async (req, res, next) => {
	try {
		const updatedResource = {
			id: req.params.task_id,
			task_description: req.body.task_description,
			task_notes: req.body.task_notes,
			task_completed: req.body.task_completed,
			project_id: req.params.id
		};
		await db.updateProject(updatedResource);
		res.status(201).json(updatedResource);
	} catch (err) {
		next(err);
	}
});

router.delete('/projects/:id/tasks/:task_id', async (req, res, next) => {
	try {
		const id = req.params.task_id;
		await db.removeTask(id);
		res.status(200).json({ message: 'Task Removed' });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
