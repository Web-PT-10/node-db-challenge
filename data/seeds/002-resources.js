exports.seed = function(knex) {
	return knex('resources').insert([
		{
			id: 1,
			resource_name: 'Resource 1',
			resource_description: 'Resource 1 description',
			project_id: 2
		},
		{
			id: 2,
			resource_name: 'Resource 2',
			resource_description: 'Resource 2 description',
			project_id: 1
		},
		{
			id: 3,
			resource_name: 'Resource 3',
			resource_description: 'Resource 3 description',
			project_id: 1
		},
		{
			id: 4,
			resource_name: 'Resource 4',
			resource_description: 'Resource 4 description',
			project_id: 3
		},
		{
			id: 5,
			resource_name: 'Resource 5',
			resource_description: 'Resource 5 description',
			project_id: 2
		}
	]);
};
