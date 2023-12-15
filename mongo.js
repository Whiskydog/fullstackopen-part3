const mongoose = require('mongoose');

if (!process.argv[2]) {
  console.log('Must specify mongodb password');
  process.exit(1);
}

const password = process.argv[2];

mongoose.set('strictQuery', false);
mongoose
  .connect(
    `mongodb+srv://alanvarde:${password}@cluster0.enllcay.mongodb.net/phonebookApp?retryWrites=true&w=majority`
  )
  .catch((error) => {
    console.log('Connection refused', error.message);
    process.exit(1);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 5) {
  Person.find({}).then((people) => {
    console.log('Phonebook:');
    people.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
} else {
  const newName = process.argv[3];
  const newNumber = process.argv[4];

  const newPerson = new Person({ name: newName, number: newNumber });
  newPerson.save().then((person) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
