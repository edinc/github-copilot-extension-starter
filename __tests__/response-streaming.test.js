import { jest } from '@jest/globals';
import { Readable } from 'node:stream';

describe('Response Streaming', () => {
  test('should create readable stream from response body', () => {
    // Mock fetch response
    const mockResponseBody = new Readable();
    mockResponseBody._read = () => {}; // Necessary for Readable streams
    
    const mockResponse = {
      body: mockResponseBody
    };
    
    // Mock response object with pipe method
    const res = {
      write: jest.fn(),
      end: jest.fn()
    };
    
    // Test that Readable.from creates a readable stream
    const readableStream = Readable.from(mockResponse.body);
    expect(readableStream).toBeInstanceOf(Readable);
  });
});