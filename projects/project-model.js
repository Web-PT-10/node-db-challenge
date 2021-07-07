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
	getResources,
	addResource,
	updateResource,
	removeResource,

	//Tasks Crud
	getAllTasks,
	getTasks,
	addTask,
	updateTask,
	removeTask
};

// Project CRUD MODEL
async function getProjectWithTasksResource(id) {
	const project = await db('projects as p')
		.select(
			'p.id',
			'p.project_name as name',
			'p.project_description as description',
			'p.project_completed as completed'
		)
		.where('p.id', id)
		.first();
	const tasks = await db('tasks as t')
		.select('t.id', 't.task_description as description', 't.task_notes as notes', 't.task_completed as completed')
		.where('t.project_id', id)
		.first();
	return {
		project,
		tasks
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
		.where('r.project_id', id);
}

async function addResource({ resource_name, resource_description, project_id }) {
	const [ project ] = await db('projects as p').where({ 'p.id': project_id });
	if (!project) {
		throw new Error('No Project THERE');
	}
	const [ resource_id ] = await db('resources').insert({ resource_name, resource_description });

	await db('project-resources').insert({ project_id: project.id, resource_id });
	return db('resources as r').where('r.id', resource_id);
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

async function getTasks(projectId) {
	const tasks = await db('projects as p')
		.where({ 'p.id': projectId })
		.join('tasks as t', 't.project_id', 'p.id')
		.select(
			'p.project_name as name',
			'p.project_description as description',
			't.task_description as description',
			't.task_notes as notes'
		);
	return tasks.map((task) => ({ ...task, task_completed: Boolean(task.task_completed) }));
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
