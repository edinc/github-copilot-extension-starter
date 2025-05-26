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
});