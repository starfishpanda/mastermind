import request from 'supertest';
import  app, {startServer, stopServer } from '../src/server/server';

// Start the server for requests
beforeAll(async () => {
  await startServer();
})

// Stop the server for requests
afterAll(async () => {
  await stopServer();
})

describe('/api/get-random-numbers returns a 4-digit number', () => {
  it('should return an array with 4 integers', async () => {
    const response = await request(app).get('/api/get-random-numbers');
    expect(response.body.length).toBe(4);
    expect(typeof response.body[0]).toBe('number');
  })
})