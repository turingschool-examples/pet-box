import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

app.locals.pets = [
  { id: 1, name: 'Bad Elmer', type: 'Dog' },
  { id: 2, name: 'Hank', type: 'Dog' },
  { id: 3, name: 'Dusty', type: 'Cat' },
  { id: 4, name: 'Aria', type: 'Dog' },
];

const send404 = res => (
  res.status(404).json('Pet not found')
);

const send422 = res => (
  res.status(422).json('Please provide a name and a type')
);

app.get('/api/v1/pets', (req, res) => {
  res.status(200).json(app.locals.pets);
});

app.post('/api/v1/pets', (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) return send422(res);
  const newPet = {
    id: Date.now(),
    name,
    type,
  };
  app.locals.pets.push(newPet);
  res.status(201).json(app.locals.pets[app.locals.pets.length - 1]);
});

app.get('/api/v1/pets/:id', (req, res) => {
  const pet = app.locals.pets.find(pet => pet.id == req.params.id);
  if (!pet) return send404(res);
  return res.status(200).json(pet);
});

app.put('/api/v1/pets/:id', (req, res) => {
  const { name, type } = req.body;
  let { id } = req.params;
  id = parseInt(id);
  let petWasFound = false;
  const newPets = app.locals.pets.map(pet => {
    if (pet.id == id) {
      petWasFound = true;
      return { id, name, type };
    } else {
      return pet;
    }
  });

  if (!name || !type) return send422(res)
  if (!petWasFound) return send404(res);

  app.locals.pets = newPets;
  return res.sendStatus(204);
});

app.delete('/api/v1/pets/:id', (req, res) => {
  const petIndex = app.locals.pets.findIndex(pet => pet.id == req.params.id);
  if (petIndex === -1) return send404(res);

  app.locals.pets.splice(petIndex, 1);
  return res.sendStatus(204);
});

export default app;