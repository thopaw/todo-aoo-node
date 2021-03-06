var express = require('express')
var router = express.Router()

var todoService = require('../todo/service.js')
var Todo = require('../todo/Todo.js')

// Extract Todo, when ID is in path
router.param("todo_id", function(req, res, next, todo_id) {
  console.log("Param - Todo ID - "+todo_id)
  let todo = todoService.todo(todo_id)
  if(!todo) {
    console.log("No todo found with id " + todo_id)
    return res.render('not_found',{
      id: todo_id
    })
  }
  req.todo = todo
  return next()
})

router.route("/")

  .get(function (req, res) {
    res.render('index',{
      'title': 'Todo App - NodeJS',
      'heading': 'Nodo Application with NodeJS'
    })
  })

router.route('/todos')

  .get(function (req, res) {
    let todos = todoService.todos()
    console.log("Todos", todos)
    res.render('todos',{
      'title': 'Todo App - NodeJS',
      'heading': 'Nodo Application with NodeJS',
      'todos': todos
    });
  })

  .post(function(req, res) {
    var todo = new Todo({
      text: req.body.text,
      done: req.body.done === 'on'
    })
    todoService.save(todo)
    res.redirect("/todos")
  })

router.route('/todos/:todo_id')

  // Gets the form of an Todo
  .get(function (req, res) {
    res.render('todo',{
      'title': 'Todo App - NodeJS',
      'heading': 'Todo - ID '+req.todo.id,
      'todo': req.todo
    });
  })

  // Edits a Todo
  .post(function(req, res) {
    var todo = req.todo
    todo.text = req.body.text
    todo.done = req.body.done === "on"
    todoService.update(todo)
    res.redirect("/todos")
  })

router.route('/todos/:todo_id/delete')
  .post(function(req, res) {
    todoService.delete(req.todo.id)
    res.redirect("/todos")
  })

module.exports = router
