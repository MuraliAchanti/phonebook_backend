const mongoose = require('mongoose')

if(process.argv.length < 3)
{
  console.log('Please provide the password')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0-mi6z7.mongodb.net/test?retryWrites=true&w=majority`
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
const personSchema = mongoose.Schema({
  name:String,
  number:String,
  id:Number
})
const Person = mongoose.model('Person',personSchema)

if(process.argv.length === 3)
{
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  }).catch(error => console.log(error))
}

const generateId = () => {
  return Math.floor(Math.random() * 1000000000)
}

if(process.argv.length === 5)
{
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    id:generateId()
  })
  person.save().then(result => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}