require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Contact = require('./models/contact')
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('content', function (req, res) {
    var obj = {}
    obj.name=req.body.name
    obj.number=req.body.number
    return JSON.stringify(obj)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
const url = process.env.MONGODB_URI

/*let phonebook = [
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
]*/

let phonebook = [

]

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${phonebook.length} people</br> ${new Date()}`)
})

app.get('/api/persons', (request, response) => {
    //response.json(phonebook)
    Contact.find({}).then(persons => {
      response.json(persons)
    })
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
    //const id = Math.floor(Math.random()*1000000)
    const body = request.body
    //body.id = id
    const person = new Contact({
      //id: id,
      name: body.name,
      number: body.number
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    /*if(!body.name) return response.status(400).json({error: 'name missing'})
    if(!body.number) return response.status(400).json({error: 'number missing'})
    if(phonebook.some(p => p.name === body.name)) return response.status(400).json({error: 'person already exists'})
    phonebook = phonebook.concat(body)
    response.json(body)*/
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server 3.11 running on port ${port}`)
})