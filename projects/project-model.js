const db = require('../data/knex-config');

module.exports = {
	//Project CRUD
	getProjectWithTasksResource,
	getProjects,
	getProjectsById,
	addProject,
	updateProject,
	removeProject,

	//Resources CRUD
	getAllResources,
	getLastResources,
	getResources,
	addResource,
	addResourceJoinTable,
	updateResource,
	removeResource,

	//Tasks Crud
	getAllTasks,
	getTasks,
	addTask,
	updateTask,
	removeTask
};

//Project CRUD MODEL
// async function getProjectWithTasksResource(id) {
// 	const project = await db('projects as p')
// 		.select(
// 			'p.id',
// 			'p.project_name as name',
// 			'p.project_description as description',
// 			'p.project_completed as completed'
// 		)
// 		.where('p.id', id)
// 		.first();
// 	const tasks = await db('tasks as t')
// 		.select('t.id', 't.task_description as description', 't.task_notes as notes', 't.task_completed as completed')
// 		.where('t.project_id', id)
// 		.first();
// 	return {
// 		project: {
// 			project,
// 			tasks
// 		}
// 	};
// }

async function getProjectWithTasksResource(id) {
	const project = await db('projects as p').select('p.*').where('p.id', id).first();
	const resource = await db('resources as r')
		.select('r.id', 'r.resource_name', 'r.resource_description')
		.where('r.project_id', id);
	const task = await db('tasks as t')
		.select('t.id', 't.task_description', 't.task_notes', 't.task_completed')
		.where('t.project_id', id);
	const resources = resource.map((item) => {
		return {
			id: item.id,
			name: item.resource_name,
			description: item.resource_description
		};
	});
	const tasks = task.map((item) => {
		return {
			id: item.id,
			name: item.task_description,
			notes: item.task_notes,
			completed: item.task_completed
		};
	});
	return {
		id: project.id,
		name: project.project_name,
		description: project.project_description,
		completed: project.project_completed,
		tasks,
		resources
	};
}

async function getProjects() {
	const projects = await db('projects as p').select(
		'p.id',
		'p.project_name as name',
		'p.project_description as description',
		'p.project_completed as completed'
	);

	return projects;
}

function getProjectsById(id) {
	return db('projects').where('id', id).first();
}

function addProject(project) {
	return db('projects').insert(project).then((id) => {
		return findById(id[0]);
	});
}

function updateProject(changes, id) {
	return db('projects').update(changes).where('projects.id', id);
}

function removeProject(id) {
	return db('projects').where('id', id).del();
}

//Resource CRUD MODEL
function getAllResources() {
	return db('resources').select('*');
}

function getResources(id) {
	return db('resources as r')
		.select('r.id', 'r.resource_name as name', 'r.resource_description as description')
		.where('r.project_id', id)
		.first();
}

function getLastResources(id) {
	return db('resources as r').where('r.project_id', id).select('r.id').max('r.id as id').first();
}

function addResource(resource) {
	return db('resources').insert(resource);
}

function addResourceJoinTable(resource) {
	return db('project-resources').insert(resource);
}

function updateResource(changes, id) {
	return db('resources').update(changes).where('resources.id', id);
}

function removeResource(id) {
	return db('resources').where('id', id).del();
}

//TASKS CRUD MODEL
function getAllTasks() {
	return db('tasks').select('*');
}

function getTasks(id) {
	return db('projects')
		.join('tasks', 'tasks.project_id', 'projects.id')
		.select('*')
		.where({ 'tasks.project_id': id });
}

function addTask(task) {
	return db('tasks').insert(task);
}

function updateTask(changes, id) {
	return db('tasks').update(changes).where('tasks.id', id);
}

function removeTask(id) {
	return db('tasks').where('id', id).del();
}

//LONELY FUNCTION :( , but the most useful one! SO FUCK ALL THE OTHER FUNCTION! YEAH FUNCTION POWER!!!!!!!
function findById(id) {
	return db('projects').where({ id }).first();
}
