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

// Test that Game route works
describe('GET /', () => {
  it('should successfully load the game', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});

// Test for getting random numbers for answer
describe('GET /api/get-random-numbers returns a 4-digit number', () => {
  it('should return an array with 4 integers', async () => {
    const response = await request(app).get('/api/get-random-numbers');
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(4);
    expect(typeof response.body[0]).toBe('number');
  })
})

// Test for user login
describe('POST /api/user-login', () => {
  it('should login the user with correct credentials', async () => {
    const response = await request(app)
      .post('/api/user-login')
      .send({ email: 'philip.murga@gmail.com', password: 'pppppppp' });
    expect([200,201]).toContain(response.status);
    expect(['User successfully created.','Login successful.']).toContain(response.body.message);
  });

  it('should reject login with incorrect credentials', async () => {
    const response = await request(app)
      .post('/api/user-login')
      .send({ email: 'philip.murga@gmail.com', password: 'wrongpassword' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Login unsuccessful, incorrect password.');
  });
});

// Test for fetching game records
describe('GET /api/get-game-records', () => {
  it('should return game records for authenticated user', async () => {
    const response = await request(app).get('/api/get-game-records');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('wins');
    expect(response.body).toHaveProperty('losses');
    expect(response.body).toHaveProperty('favoriteNumber');
  });

  it('should return error when no session or user found', async () => {
    const response = await request(app).get('/api/get-game-records');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});

// Test for user logout
describe('POST /api/user-logout', () => {
  it('should successfully log out the user', async () => {
    const response = await request(app).post('/api/user-logout');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout Successful');
  });
});

// Test for deleting an account
describe('DELETE /api/delete-account', () => {
  it('should delete the user account', async () => {
    const response = await request(app).delete('/api/delete-account');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User account successfully deleted');
  });

  it('should return an error if no user found for delete', async () => {
    const response = await request(app).delete('/api/delete-account');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No user found with that ID');
  });
});
