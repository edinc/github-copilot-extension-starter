import { jest } from '@jest/globals';

// Mock the Octokit module
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

describe('GitHub API Integration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    mockOctokit.mockClear();
    mockRequest.mockClear();
  });

  test('should authenticate with GitHub API using token', async () => {
    const { Octokit } = await import('@octokit/core');
    const token = 'test-token';
    const octokit = new Octokit({ auth: token });
    
    // Verify Octokit constructor was called with the right token
    expect(mockOctokit).toHaveBeenCalledWith({ auth: token });
  });

  test('should fetch user data from GitHub API', async () => {
    const { Octokit } = await import('@octokit/core');
    const token = 'test-token';
    const octokit = new Octokit({ auth: token });
    const user = await octokit.request('GET /user');
    
    // Verify request was called
    expect(mockRequest).toHaveBeenCalledWith('GET /user');
    
    // Verify the returned data
    expect(user.data.login).toBe('testuser');
  });
  
  test('should handle GitHub API errors gracefully', async () => {
    // Setup mock to throw an error
    mockRequest.mockRejectedValueOnce(new Error('API rate limit exceeded'));
    
    const { Octokit } = await import('@octokit/core');
    const token = 'test-token';
    const octokit = new Octokit({ auth: token });
    
    // Test error handling
    await expect(octokit.request('GET /user')).rejects.toThrow('API rate limit exceeded');
  });
  
  test('should handle different GitHub API endpoints', async () => {
    // Mock a different response for repos endpoint
    mockRequest.mockImplementationOnce((endpoint) => {
      if (endpoint === 'GET /user/repos') {
        return Promise.resolve({
          data: [
            { name: 'repo1', private: false },
            { name: 'repo2', private: true }
          ]
        });
      }
      return Promise.resolve({ data: { login: 'testuser' } });
    });
    
    const { Octokit } = await import('@octokit/core');
    const token = 'test-token';
    const octokit = new Octokit({ auth: token });
    const repos = await octokit.request('GET /user/repos');
    
    // Verify request was called with correct endpoint
    expect(mockRequest).toHaveBeenCalledWith('GET /user/repos');
    
    // Verify the returned data
    expect(repos.data).toHaveLength(2);
    expect(repos.data[0].name).toBe('repo1');
    expect(repos.data[1].name).toBe('repo2');
  });
});