const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fsopen:${password}@cluster0.liih1bl.mongodb.net/testApp?retryWrites=true&w=majority`


const contactSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if(process.argv.length === 5) {

  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')
      const contact = new Contact({
        id: Math.floor(Math.random()*1000000),
        name: process.argv[3],
        number: process.argv[4],
      })

      return contact.save()
    })
    .then(() => {
      console.log('Contact saved!')
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}

else if(process.argv.length === 3) {
  mongoose.connect(url)
    .then(() => {
      console.log('Phonebook:')
      Contact.find().then(result => {
        result.forEach(contact => {
          console.log(contact.name, contact.number)
        })
        mongoose.connection.close()
      })
    })
}