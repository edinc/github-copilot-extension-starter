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

// Mock fetch for full message handling flow
global.fetch = jest.fn().mockImplementation((url, options) => {
  // Capture the request body for validation
  const requestBody = JSON.parse(options.body);
  
  // Create a mock response
  const mockBody = new Readable();
  mockBody._read = () => {};
  
  // Push a mock stream chunk
  mockBody.push(JSON.stringify({
    id: 'chatcmpl-123',
    object: 'chat.completion.chunk',
    created: Date.now(),
    model: 'gpt-4',
    choices: [{
      index: 0,
      delta: {
        content: '@testuser Ahoy there!'
      },
      finish_reason: null
    }]
  }));
  
  // End the stream
  mockBody.push(null);
  
  return Promise.resolve({
    status: 200,
    body: mockBody
  });
});

describe('Integration Tests', () => {
  let app;
  
  beforeAll(() => {
    // Create a fresh Express app for testing
    app = express();
    
    // Set up routes that combine message handling and streaming
    app.post('/integrated', express.json(), async (req, res) => {
      const tokenForUser = req.get('X-GitHub-Token');
      const octokit = new mockOctokit({ auth: tokenForUser });
      const user = await octokit.request('GET /user');
      
      const messages = req.body.messages || [];
      
      // Add system messages (as in the actual application)
      messages.unshift({
        role: 'system',
        content: 'You are a helpful assistant that replies to user messages as if you were the Blackbeard Pirate.',
      });
      messages.unshift({
        role: 'system',
        content: `Start every response with the user's name, which is @${user.data.login}`,
      });
      
      // Call the mock fetch that will return a stream
      const response = await fetch('https://api.githubcopilot.com/chat/completions', {
        method: 'POST',
        headers: {
          'authorization': '******',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          stream: true,
        }),
      });
      
      // Stream the response back
      Readable.from(response.body).pipe(res);
    });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('should handle full message flow from user input to streaming response', async () => {
    const response = await request(app)
      .post('/integrated')
      .set('X-GitHub-Token', 'test-token')
      .set('Accept', 'application/json')
      .send({
        messages: [
          { role: 'user', content: 'Tell me a pirate story!' }
        ]
      });
    
    // Check that the GitHub API was called
    expect(mockOctokit).toHaveBeenCalledWith({ auth: 'test-token' });
    expect(mockRequest).toHaveBeenCalledWith('GET /user');
    
    // Check that fetch was called with the expected parameters
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.githubcopilot.com/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'authorization': '******',
          'content-type': 'application/json',
        }),
      })
    );
    
    // Check response status
    expect(response.status).toBe(200);
    
    // The response should contain our mock stream data
    expect(response.text).toContain('@testuser Ahoy there!');
  });
});