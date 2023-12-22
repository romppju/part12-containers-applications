const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as argument!')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://romppainenj:${password}@cluster0.dcvsbxa.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {   
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(p => {
      console.log(p.name, p.number)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log('Person saved!')
    mongoose.connection.close()
  })
}


