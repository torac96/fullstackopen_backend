require('dotenv').config()
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/note')
const app = express();

//i use this middleware to parse the incoming request to json
app.use(express.static('build'))
app.use(cors());
app.use(express.json());

morgan.token('body', (req, res) => {
  if (Object.getOwnPropertyNames(req.body).length !== 0) {
    return JSON.stringify(req.body);
  }
  return null;
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response) => {
  Person.find({}).then(person => {
    const text = `Phonebook has info for ${person.length} people <br><br>
    ${new Date().toString()}`;
    response.send(text);
  })
})

//Handle the get all people request and retrive persons resource
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(nopersonte)
  })
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id).then(person => {
    response.status(204).end()
  }).catch((error) => {
    response.status(404).end();
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name && !body.phone) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  
  const person = Person({
    name: body.name,
    phone: body.phone,
  })

  Person.find({}).then(persons => {
    
    if (persons.some(person => person.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })
})


//handle all the requests that come to PORT 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})