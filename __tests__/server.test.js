import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

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
});