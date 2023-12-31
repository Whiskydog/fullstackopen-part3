const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('Connecting to MongoDB');
mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Names must be at least 3 characters long'],
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: (v) => /^\d{2,3}-\d{7,8}/.test(v),
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});

personSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
