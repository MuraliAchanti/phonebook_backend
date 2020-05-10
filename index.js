require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')
const errorHandler = (error,request,response,next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(function(tokens,req,res){
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
app.use(errorHandler)

app.get('/api/phonebook',(request,response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/phonebook/:id',(request,response,next) => {
  Person.findById(request.params.id).then(person => {
    if(person)
      response.json(person.toJSON())
    else
      response.status(404).end()
  }).catch(error => {
    next(error)
  })
})

app.delete('/api/phonebook/:id',(request,response,next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

app.post('/api/phonebook',(request,response) => {
  const body = request.body
  if(!body.name)
    return response.status(400).json({ error : 'please enter name' })
  if(!body.number)
    return response.status(400).json({ error : 'please enter number' })
  const allPersons = []
  Person.find({}).then(result => {
    allPersons = result.map(person => person.name)
  })
  if(allPersons.find(name => name === body.name))
  {

  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(result => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
    response.json(result.toJSON())
  }).catch(error => {
    if(error.name === 'ValidationError')
      response.status(400).send({ error:error.message })
  })
})

app.get('/api/info',(request,response) => {
  const persons = any
  Person.find({}).then(result => {
    persons = result.length
  })
  const date = new Date()
  response.send(`<div>Phonebook has info for ${persons} people</div><div>${date.toString()}</div>`)
})

app.put('/api/phonebook/:id',(request,response,next) => {
  const body = request.body
  const person = {
    name:body.name,
    number:body.number
  }
  Person.findByIdAndUpdate(request.params.id,person,{ new:true })
    .then(result => {
      response.json(result.toJSON())
    }).catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

