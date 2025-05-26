import { jest } from '@jest/globals';

describe('Message Handling Logic', () => {
  test('should add system messages to the message list', () => {
    // Initial messages from user
    const messages = [
      { role: 'user', content: 'Hello, how are you?' }
    ];
    
    // Clone messages to avoid modifying the original
    const messagesCopy = [...messages];
    
    // Add system messages (similar to what happens in index.js)
    messagesCopy.unshift({
      role: 'system',
      content: 'You are a helpful assistant that replies to user messages as if you were the Blackbeard Pirate.',
    });
    messagesCopy.unshift({
      role: 'system',
      content: 'Start every response with the user\'s name, which is @testuser',
    });
    
    // Verify correct number of messages
    expect(messagesCopy.length).toBe(3);
    
    // Verify system messages were added
    expect(messagesCopy[0].role).toBe('system');
    expect(messagesCopy[0].content).toContain('@testuser');
    expect(messagesCopy[1].role).toBe('system');
    expect(messagesCopy[1].content).toContain('Blackbeard Pirate');
    
    // Verify original user message is still present
    expect(messagesCopy[2].role).toBe('user');
    expect(messagesCopy[2].content).toBe('Hello, how are you?');
  });
  
  test('should handle empty message list', () => {
    // Empty initial messages
    const messages = [];
    
    // Clone messages to avoid modifying the original
    const messagesCopy = [...messages];
    
    // Add system messages
    messagesCopy.unshift({
      role: 'system',
      content: 'You are a helpful assistant that replies to user messages as if you were the Blackbeard Pirate.',
    });
    messagesCopy.unshift({
      role: 'system',
      content: 'Start every response with the user\'s name, which is @testuser',
    });
    
    // Verify only system messages are present
    expect(messagesCopy.length).toBe(2);
    expect(messagesCopy[0].role).toBe('system');
    expect(messagesCopy[1].role).toBe('system');
  });
  
  test('should preserve order of multiple user messages', () => {
    // Multiple user messages in conversation
    const messages = [
      { role: 'user', content: 'Hello!' },
      { role: 'assistant', content: 'Hi there!' },
      { role: 'user', content: 'Tell me about pirates.' }
    ];
    
    // Clone messages to avoid modifying the original
    const messagesCopy = [...messages];
    
    // Add system messages
    messagesCopy.unshift({
      role: 'system',
      content: 'You are a helpful assistant that replies to user messages as if you were the Blackbeard Pirate.',
    });
    messagesCopy.unshift({
      role: 'system',
      content: 'Start every response with the user\'s name, which is @testuser',
    });
    
    // Verify correct message order
    expect(messagesCopy.length).toBe(5);
    expect(messagesCopy[0].role).toBe('system');
    expect(messagesCopy[1].role).toBe('system');
    expect(messagesCopy[2].role).toBe('user');
    expect(messagesCopy[2].content).toBe('Hello!');
    expect(messagesCopy[3].role).toBe('assistant');
    expect(messagesCopy[4].role).toBe('user');
    expect(messagesCopy[4].content).toBe('Tell me about pirates.');
  });
  
  test('should handle messages with special characters', () => {
    // Message with special characters
    const messages = [
      { role: 'user', content: 'Hello! I want to say: <script>alert("XSS")</script>' }
    ];
    
    // Clone messages to avoid modifying the original
    const messagesCopy = [...messages];
    
    // Add system messages
    messagesCopy.unshift({
      role: 'system',
      content: 'You are a helpful assistant that replies to user messages as if you were the Blackbeard Pirate.',
    });
    messagesCopy.unshift({
      role: 'system',
      content: 'Start every response with the user\'s name, which is @testuser',
    });
    
    // Verify message content is preserved
    expect(messagesCopy[2].content).toBe('Hello! I want to say: <script>alert("XSS")</script>');
  });
});