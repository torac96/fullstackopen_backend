require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

//i use this middleware to parse the incoming request to json
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
  if (Object.getOwnPropertyNames(req.body).length !== 0) {
    return JSON.stringify(req.body)
  }
  return null
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response, next) => {
  Person.find({}).then(person => {
    const text = `Phonebook has info for ${person.length} people <br><br>
    ${new Date().toString()}`
    response.send(text)
  }).catch(error => next(error))
})

//Handle the get all people request and retrive persons resource
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(person => {
    if (person) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = Person({
    name: body.name,
    phone: body.phone,
  })

  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedPersonFormatted => response.json(savedPersonFormatted))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    phone: body.phone,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

//handle all the requests that come to PORT 3001
// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})