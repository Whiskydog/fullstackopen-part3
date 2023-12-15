const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI).catch((error) => {
  console.log('Connection refused', error.message);
  process.exit(1);
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
  Person.find({}).then((people) => {
    console.log('Phonebook:');
    people.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
} else {
  const newName = process.argv[2];
  const newNumber = process.argv[3];

  const newPerson = new Person({ name: newName, number: newNumber });
  newPerson.save().then((person) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
