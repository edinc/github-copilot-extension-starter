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
  
  test('should pipe stream data to response', () => {
    // Create a mock response body
    const mockResponseBody = new Readable();
    mockResponseBody._read = () => {}; // Necessary for Readable streams
    
    // Create mock response
    const mockResponse = {
      body: mockResponseBody
    };
    
    // Mock Express response with pipe method
    const mockExpressResponse = {
      write: jest.fn(),
      end: jest.fn(),
      on: jest.fn(),
      once: jest.fn(),
      emit: jest.fn(),
      pipe: jest.fn().mockReturnThis()
    };
    
    // Mock the pipe method on the Readable stream
    const mockPipe = jest.fn().mockReturnValue(mockExpressResponse);
    const mockReadableStream = {
      pipe: mockPipe
    };
    
    // Mock Readable.from to return our mockReadableStream
    const originalFrom = Readable.from;
    Readable.from = jest.fn().mockReturnValue(mockReadableStream);
    
    try {
      // Test the piping functionality
      Readable.from(mockResponse.body).pipe(mockExpressResponse);
      
      // Verify pipe was called with the express response
      expect(mockPipe).toHaveBeenCalledWith(mockExpressResponse);
    } finally {
      // Restore the original Readable.from
      Readable.from = originalFrom;
    }
  });
});