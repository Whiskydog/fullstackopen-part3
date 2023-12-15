require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const errorHandler = (err, _req, res, next) => {
  switch (err.name) {
    case 'CastError':
      res.status(400).send({ error: 'Wrong id format' });
      break;
    case 'ValidationError':
      res.status(400).send({ error: Object.values(err.errors)[0].message });
      break;
    default:
      next(err);
      break;
  }
};

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

app.get('/api/persons', (_req, res) => {
  Person.find({}).then((people) => res.json(people));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) res.json(person);
      else res.status(404).end();
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;
  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true }
  )
    .then((person) => {
      if (person) res.json(person);
      else res.status(404).end();
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { body } = req;

  if (!body.name || !body.number)
    return res.status(400).json({ error: 'Missing name or number' });

  const { name, number } = body;
  const newPerson = new Person({ name, number });

  newPerson
    .save()
    .then((person) => res.json(person))
    .catch((error) => next(error));
});

app.get('/info', (_req, res) => {
  Person.estimatedDocumentCount().then((count) => {
    const html = `
    <div>
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>
    </div>`;
    res.send(html);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
