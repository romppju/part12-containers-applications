const redis = require('../redis')

const express = require('express')
const router = express.Router()

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits,
  })
})

router.get('/statistics', async (_req, res) => {
  const todoCount = await redis.getAsync('todoCount')
  res.send({ added_todos: todoCount ? todoCount : 0 })
})

module.exports = router
