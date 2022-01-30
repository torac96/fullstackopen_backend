const express = require('express');
const cors = require('cors');
const app = express();

//i use this middleware to parse the incoming request to json
app.use(cors());
app.use(express.json());

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "phone": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "phone": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "phone": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "phone": "39-23-6423122"
  }
];

app.get('/info', (request, response) => {
  const text = `
  Phonebook has info for ${persons.length} people <br><br>

  ${new Date().toString()}
  `;
  response.send(text);
})

//Handle the get all people request and retrive persons resource
app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if(person){
    response.json(person);
  }else{
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id);
  if(person){
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  }else{
    response.status(404).end();
  }
})

function getRandomInt() {
  return Math.floor(Math.random() * 999999999999999);
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name && !body.phone) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  if(persons.some(person => person.name === body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    phone: body.phone,
    id: getRandomInt(),
  }

  persons = persons.concat(person)

  response.json(person)
})


//handle all the requests that come to PORT 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})