var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js')
var app = express();

var PORT = process.env.PORT || 3000;
app.use(bodyParser.json());


var todoNextId = 1;
var todos = [];
app.get('/', function(req, res) {
    res.send('Todo Api Root');
});



//get /totos?completed=true&q=work
app.get('/todos', function(req, res) {
    var queryParams = req.query;
    //console.log(queryParams.completed);
    var filterdTodos = todos;
    if (queryParams.hasOwnProperty('completed') && (queryParams.completed === 'true')) {
        filterdTodos = _.where(filterdTodos, {
            completed: true
        });
        console.log('bin imm completed true');
    } else if (queryParams.hasOwnProperty('completed') && (queryParams.completed === 'false')) {
        filterdTodos = _.where(filterdTodos, {
            completed: false
        });
        console.log('bin imm completed false');
    }

    if (queryParams.hasOwnProperty('q') && (queryParams.q.length > 0)) {
        console.log('bin imm filter');
        filterdTodos = _.filter(filterdTodos, function(todo) {
            var such = queryParams.q;
            console.log(todo);
            return todo.description.indexOf(such) > -1;
        });

    }


    res.json(filterdTodos);

});



app.get('/todos/:id', function(req, res) {
    //res.send('Asking for id: ' + req.params.id);
    var todId = parseInt(req.params.id, 10)
    var matcheTodo = _.findWhere(todos, {
        id: todId
    })

    if (matcheTodo) {
        res.json(matcheTodo);
    } else {
        res.status(404).send();
    }
});


app.post('/todos/', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    console.log('Descripton: ' + body.description);


    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }, function(e) {
res.status(400).json(e);
    });




    // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    //     return res.status(400).send();
    // }

    // var todo = {
    //     id: todoNextId,
    //     description: body.description.trim(),
    //     completed: body.completed
    // }
    // todos.push(todo);
    // todoNextId++;
    // console.log('Descripton: ' + body.description);
    // res.json(body);

});


app.delete('/todos/:id', function(req, res) {
    var todId = parseInt(req.params.id, 10)
    var matcheTodo = _.findWhere(todos, {
        id: todId
    })

    if (!matcheTodo) {
        return res.status(400).json({
            "error": "no todo found"
        });
    } else {
        todos = _.without(todos, matcheTodo);
        var data = {
            matcheTodo: matcheTodo,
            todos: todos
        }
        res.json(data);
    }
});

app.put('/todos/:id', function(req, res) {

    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    // check input
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.completed) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }


    // update   mit _extend
    var todId = parseInt(req.params.id, 10)
    var matcheTodo = _.findWhere(todos, {
        id: todId
    })
    if (!matcheTodo) {
        return res.status(404).json({
            "error": "no todo found"
        });
    }
    _.extend(matcheTodo, validAttributes);
    res.json(matcheTodo);

});
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on Port: ' + PORT)
    });
})