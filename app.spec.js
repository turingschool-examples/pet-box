import request from 'supertest';
import '@babel/polyfill';
import app from './app';

describe('get /api/v1/pets', () => {
  it('should return a 200', async () => {
    const response = await request(app).get('/api/v1/pets');
    expect(response.statusCode).toBe(200);
  });
});
