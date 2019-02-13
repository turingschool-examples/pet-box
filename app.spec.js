import request from 'supertest';
import '@babel/polyfill';
import app from './app';

describe('api', () => {
  let pets;
  beforeEach(() => {
    pets = [
      { id: 1, name: 'Bad Elmer', type: 'Dog' },
      { id: 2, name: 'Hank', type: 'Dog' },
      { id: 3, name: 'Dusty', type: 'Cat' },
    ];
    app.locals.pets = pets;
  });

  describe('get /api/v1/pets', () => {
    it('should return a 200', async () => {
      const response = await request(app).get('/api/v1/pets');
      expect(response.status).toBe(200);
    });

    it('should respond with an array of pets', async () => {
      const response = await request(app).get('/api/v1/pets');
      expect(response.body).toEqual(pets);
    });
  });

  describe('get /api/v1/pets/:id', () => {
    it('should return a 200 if the pet exists', async () => {
      const response = await request(app).get('/api/v1/pets/1');
      expect(response.status).toBe(200);
    });

    it('should respond with the correct pet if it exists', async () => {
      const response = await request(app).get('/api/v1/pets/1');
      expect(response.body).toEqual(pets[0]);
    });

    it('should return a 404 if the pet doesn\'t exist', async () => {
      const response = await request(app).get('/api/v1/pets/7');
      expect(response.status).toBe(404);
    });

    it('should return a no pet message if the pet doesn\'t exist', async () => {
      const response = await request(app).get('/api/v1/pets/7');
      expect(response.body).toBe('Pet not found');
    });
  });

  describe('post /api/v1/pets', () => {
    it('should return a 201 and a new pet (with an id) if things go well', async () => {
      const goodPetInfo = { name: 'Fido', type: 'dog' };
      Date.now = jest.fn().mockImplementation(() => 10);
      const response = await request(app).post('/api/v1/pets')
        .send(goodPetInfo);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 10, ...goodPetInfo });
    });

    it('should return a 422 and error message if the info sent is not ok', async () => {
      const badPetInfo = { natype: 'dog' };
      const response = await request(app).post('/api/v1/pets')
        .send(badPetInfo);
      expect(response.status).toBe(422);
      expect(response.body).toBe('Please provide a name and a type');
    });
  });
});
