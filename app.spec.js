import request from 'supertest';
import '@babel/polyfill';
import app from './app';

describe('Api', () => {
  let mockPets;
  beforeEach(() => {
    mockPets = [
      { id: 1, name: 'fido', type: 'dog' },
      { id: 2, name: 'little orange monster', type: 'cat' },
    ];

    app.locals.pets = mockPets;
  });

  describe('get /api/v1/pets', () => {
    it('should respond with a 200', async () => {
      const response = await request(app).get('/api/v1/pets');
      expect(response.status).toBe(200);
    });

    it('should respond with all the pets', async () => {
      const response = await request(app).get('/api/v1/pets');
      expect(response.body).toEqual(mockPets);
    });
  });

  describe('get /api/v1/pets/:id', () => {
    it('should respond with a 200 and the correct pet', async () => {
      const response = await request(app).get('/api/v1/pets/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPets[0]);
    });

    it('should respond with a 404 and error message if it can\'t find the pet', async () => {
      const response = await request(app).get('/api/v1/pets/5');
      expect(response.status).toBe(404);
      expect(response.body).toEqual('Pet not found');
    });
  });

  describe('post /api/v1/pets', () => {
    const path = '/api/v1/pets';
    it('should create a pet and provide a 201 status', async () => {
      Date.now = jest.fn().mockImplementationOnce(() => 4);

      const response = await request(app).post(path)
        .send({ name: 'balto', type: 'doge', legs: 4 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: 4, name: 'balto', type: 'doge' });
    });

    it('should respond with a 422 and error if unsuccessful', async () => {
      const response = await request(app).post(path).send({afddsfdas: 'fadsdas'});
      expect(response.status).toBe(422);
      expect(response.body).toBe('Please provide a name and a type');
    });
  });

  describe('put /api/v1/pets/:id', () => {
    it('should respond with a 204 successful and update data model', async () => {
      expect(app.locals.pets[0]).toEqual(mockPets[0]);

      const response = await request(app).put('/api/v1/pets/1')
        .send({ name: 'lassie', type: 'rock' });
      expect(response.status).toBe(204);
      expect(app.locals.pets[0]).toEqual({ id: mockPets[0].id, name: 'lassie', type: 'rock' });
    });

    it('should return a 422 and an error message if the request body is not ok', async () => {
      expect(app.locals.pets[0]).toEqual(mockPets[0]);

      const response = await request(app).put('/api/v1/pets/1')
        .send({ nddame: 'lassie', type: 'rock' });
      expect(response.status).toBe(422);
      expect(app.locals.pets[0]).toEqual(mockPets[0]);
    });

    it('should return a 404 and error message if the pet isn\'t found', async () => {
      expect(app.locals.pets[0]).toEqual(mockPets[0]);

      const response = await request(app).put('/api/v1/pets/5')
        .send({ nddame: 'lassie', type: 'rock' });
      expect(response.status).toBe(422);
      expect(app.locals.pets[0]).toEqual(mockPets[0]);
    });
  });

  describe('delete /api/v1/pets/:id', () => {
    it('should delete a pet and return a 204', async () => {
      expect(app.locals.pets[0].id).toEqual(1);

      const response = await request(app).delete('/api/v1/pets/1');
      expect(response.status).toBe(204);
      expect(app.locals.pets[0].id).toEqual(2);
    });

    it('should return a 404 if the pet isn\'t there', async () => {
      expect(app.locals.pets[0].id).toEqual(1);

      const response = await request(app).delete('/api/v1/pets/5');
      expect(response.status).toBe(404);
      expect(response.body).toBe('Pet not found');
      expect(app.locals.pets[0].id).toEqual(1);
    });
  });
});