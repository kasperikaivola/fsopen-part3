const express = require('express')
const app = express()

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

app.use(express.json())

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

app.delete('api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
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

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)