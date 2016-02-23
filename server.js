var express = require('express');
var app = express();

var PORT = process.env.PORT || 3000;

var todos = [
    {
        id: 1,
        description: 'Meet mum for lunch',
        completed: false
},
    {
        id: 2,
        description: 'futtter',
        completed: false
},
    {
        id: 3,
        description: 'blume',
        completed: true
}
];
app.get('/', function (req, res) {
    res.send('Todo Api Root');
});


app.get('/todos', function (req, res) {
    res.json(todos);
    
});

app.get('/todos/:id', function (req, res) {
    //res.send('Asking for id: ' + req.params.id);
    var todId = parseInt(req.params.id,10)
    var matcheTodo;
    todos.forEach(function (todo) {
        if (todId === todo.id) {
            matcheTodo = todo;
        }
    });

    if (matcheTodo) {
        res.json(matcheTodo);
    } else {
        res.status(404).send();
    }
});


app.listen(PORT, function () {
    console.log('Express listening on Port: ' + PORT)
});