const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())
morgan.token('content', function (req, res) {
    var obj = {}
    obj.name=req.body.name
    obj.number=req.body.number
    return JSON.stringify(obj)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${phonebook.length} people</br> ${new Date()}`)
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(p => p.id === id)
    if(person) response.json(person)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random()*1000000)
    const person = request.body
    person.id = id
    if(!person.name) return response.status(400).json({error: 'name missing'})
    if(!person.number) return response.status(400).json({error: 'number missing'})
    if(phonebook.some(p => p.name === person.name)) return response.status(400).json({error: 'person already exists'})
    phonebook = phonebook.concat(person)
    response.json(person)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server 3.10 running on port ${port}`)
})