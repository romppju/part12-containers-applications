const redis = require('../redis')

const express = require('express')
const { Todo } = require('../mongo')
const router = express.Router()

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos)
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  })

  const todoCount = await redis.getAsync('todoCount')
  const newTodoCount = todoCount ? Number(todoCount) + 1 : 1
  await redis.setAsync('todoCount', newTodoCount)

  res.send(todo)
})

const singleRouter = express.Router()

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200)
})

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = req.todo
  res.send(todo)
  //res.sendStatus(405); // Implement this
})

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const newTodo = {
    text: req.body.text,
    done: req.body.done || false,
  }

  Todo.findByIdAndUpdate(req.todo._id, newTodo, { new: true })
    .then((updatedTodo) => {
      res.json(updatedTodo)
    })
    .catch((error) => {
      console.log(error)
      res.status(400).send({ error: 'Update failed' })
    })

  //res.sendStatus(405) // Implement this
})

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router
