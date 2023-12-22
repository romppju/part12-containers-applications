require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const Person = require('./models/person')

const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))

/*
let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]
*/

app.get('/api/persons', (req, res) => {
  //res.json(persons)
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  const today = new Date()
  const todayString = today.toString()

  Person.find({}).then((persons) => {
    const size = persons.length
    res.send(`<p>The phonebook has info for ${size} people</p>
                <p>${todayString}</p>`)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  /*
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
      res.json(person)
  } else {
    res.status(404).end()
  }
  */
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  /*
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
  */
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  /*
  const names = persons.map(p => p.name.toLowerCase())
  if (!body.name || !body.number) {
    return res.status(400).json({
    error: 'missing name or number'
  })
  }
  if (names.includes(body.name.toLowerCase())) {      
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  */

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      console.log('Person saved!')
      res.json(savedPerson)
    })
    .catch((error) => next(error))

  //person.id = Math.floor(Math.random() * 10000)
  //persons = persons.concat(person)
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  /*
  const person = {
    name: body.name,
    number: body.number,
  }
  */
  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    //console.log('VALIDATION ERROR OCCURRED')
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log('Server running on', PORT)
})
