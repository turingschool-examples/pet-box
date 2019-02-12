import express from 'express';
const app = express();
//
import cors from 'cors';
app.use(cors());
//
app.use(express.json());
app.set('port', 3001);

app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')}`)
});

app.locals.pets = [
  { id: 1, name: 'Bad Elmer', type: 'Dog' },
  { id: 2, name: 'Hank', type: 'Dog' },
  { id: 3, name: 'Dusty', type: 'Cat' },
  { id: 4, name: 'Aria', type: 'Dog' },
];

app.get('/', (req, res) => {
  res.status(200).json('hello world');
});

app.get('/api/v1/pets', (req, res) => {
  res.status(200).json(app.locals.pets);
});

app.get('/api/v1/pets/:id', (req, res) => {
  const pet = app.locals.pets.find(pet => pet.id == req.params.id);
  if (!pet) return res.status(404).json('Pet not found');
  return res.status(200).json(pet);
});

app.post('/api/v1/pets', (req, res) => {
  // body needs name and type
  const { name, type } = req.body;
  if (!name || !type) return res.status(422).json('Please provide a name and a type');
  const newPet = {
    id: Date.now(),
    ...req.body,
  };
  app.locals.pets.push(newPet);
  res.status(201).json(newPet);
});

