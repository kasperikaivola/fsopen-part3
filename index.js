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

app.get('/info', (request, response) => {
    Contact.find({}).then(persons => {
      response.send(`Phonebook has info for ${persons.length} people</br> ${new Date()}`)
    })
})

app.get('/api/persons', (request, response) => {
    //response.json(phonebook)
    Contact.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    /*const id = Number(request.params.id)
    const person = phonebook.find(p => p.id === id)
    if(person) response.json(person)
    else response.status(404).end()*/
    Contact.findById(request.params.id)
      .then(contact => {
        if(contact) response.json(contact)
        else {
          //console.log(error)
          response.status(404).send
          //throw new Error('InvalidIDError')
        }
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    /*const id = Number(request.params.id)
    phonebook = phonebook.filter(p => p.id !== id)
    response.status(204).end()*/
    Contact.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
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

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = new Contact({
    name: body.name,
    number: body.number,
    _id: body.id
  })
  Contact.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error,request,response,next) => { //error handler middleware
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } 
  else {
    return response.status(400).send({error: error.message})
  } 
  next(error)
}

app.use(errorHandler)
const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server 3.18 running on port ${port}`)
})