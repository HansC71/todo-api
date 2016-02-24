var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		notEmty: true
	},

	completed: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}

})

sequelize.sync({
	force: true
}).then(function() {
	console.log('alles gesynct')

	Todo.create({
		description: "Walk my dog",
		completed: false
	}).then(function(todo) {
		console.log('Fertig');
		console.log(todo);
	}).catch(function(e){
		console.log(e);
	});
});