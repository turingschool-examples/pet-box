import request from 'supertest';
import '@babel/polyfill';
import app from './app';

describe('get /api/v1/pets', () => {
  // Three things we need to test:
  // response status code
  // response text
  // any changes to our data set that should occur

  it('should return a 200', () => {
    request(app).get('/api/v1/pets').then((res) => {
      expect(res.statusCode).toBe(200);
    });
  });
});
