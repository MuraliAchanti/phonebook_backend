const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

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




let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/api/phonebook',(request,response) => {
    response.json(persons)
})

app.get('/api/phonebook/:id',(request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person)
        response.json(person)
    else    
        response.status(404).end()
})

app.delete('/api/phonebook/:id',(request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = Math.random() * 1000000000
    return maxId
}

app.post('/api/phonebook',(request,response) => {
    const body = request.body
    if(!body.name)
       return response.status(400).json({error : "please enter name"})
    else if(persons.find(person => person.name === body.name))
        return response.status(400).json({error : "please enter unique name"})
    if(!body.number)
        return response.status(400).json({error : "please enter number"})
    const person = {
        name : body.name,
        number : body.number,
        id : generateId()
    }
    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/info',(request,response) => {
    const date = new Date()
    response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${date.toString()}</div>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

