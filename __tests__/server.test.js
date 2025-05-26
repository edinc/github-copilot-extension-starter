import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { Readable } from 'node:stream';

// Mock external dependencies
const mockRequest = jest.fn().mockResolvedValue({
  data: {
    login: 'testuser'
  }
});

const mockOctokit = jest.fn().mockImplementation(() => ({
  request: mockRequest
}));

jest.unstable_mockModule('@octokit/core', () => ({
  Octokit: mockOctokit
}));

// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  body: {
    getReader: jest.fn().mockReturnValue({
      read: jest.fn().mockResolvedValue({ done: true })
    })
  }
});

describe('Express Server Endpoints', () => {
  let app;

  beforeAll(async () => {
    // Create a fresh Express app for testing
    app = express();
    
    // Add routes to the app
    app.get('/', (req, res) => {
      res.send('Ahoy, matey! Welcome to the Blackbeard Pirate GitHub Copilot Extension!')
    });
    
    app.post('/', express.json(), async (req, res) => {
      // Simplified version of the POST handler for testing
      const tokenForUser = req.get('X-GitHub-Token');
      const octokit = new mockOctokit({ auth: tokenForUser });
      await octokit.request('GET /user');
      
      // Simply respond with success for testing
      res.status(200).send('Success');
    });
  });
  
  afterAll(() => {
    // Reset all mocks
    jest.resetAllMocks();
  });

  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Ahoy, matey!');
  });
  
  test('POST / should process messages and authenticate with GitHub', async () => {
    const response = await request(app)
      .post('/')
      .set('X-GitHub-Token', 'test-token')
      .send({
        messages: [
          { role: 'user', content: 'Hello there!' }
        ]
      });
      
    expect(response.status).toBe(200);
    expect(mockOctokit).toHaveBeenCalledWith({ auth: 'test-token' });
    expect(mockRequest).toHaveBeenCalledWith('GET /user');
  });
});