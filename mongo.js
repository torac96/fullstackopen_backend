/* eslint-disable no-undef */
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://test:${password}@cluster0.h3ayy.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
  date: Date,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.phone}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length >= 5) {
  const name = process.argv[3]
  const phone = process.argv[4]
  const person = new Person({
    name,
    phone,
    date: new Date(),
  })

  person.save().then(() => {
    console.log(`added ${name} number ${phone} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Please provide the the name and the phone of the person to insert into phonebook as an argument: node mongo.js <password> <user> <phone>')
  mongoose.connection.close()
  process.exit(1)
}