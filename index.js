require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

morgan.token('body', (req) => {
  if (req.method === 'POST') return JSON.stringify(req.body);
  return '\b';
});

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (_req, res) => {
  Person.find({}).then((people) => res.json(people));
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) return res.json(person);
  res.status(404).end();
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res) => {
  const { body } = req;

  if (!body.name || !body.number)
    return res.status(400).json({ error: 'Missing name or number' });

  const { name, number } = body;
  const newPerson = new Person({ name, number });

  newPerson.save().then((person) => res.json(person));
});

app.get('/info', (_req, res) => {
  const html = `
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>
  `;

  res.send(html);
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
