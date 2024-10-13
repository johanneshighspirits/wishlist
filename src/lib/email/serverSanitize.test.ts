import { describe, expect, it } from 'vitest';
import { serverSanitizeUserInput } from './serverSanitize';

describe('serverSanitize', () => {
  it('should sanitize user input', () => {
    expect(serverSanitizeUserInput('email@valid.com')).toBe('email@valid.com');
    expect(
      serverSanitizeUserInput('email@valid.com<script >const hacker</script>')
    ).toBe('email@valid.com');
    expect(serverSanitizeUserInput('💝 Emoji title! 🦄')).toBe(
      '💝 Emoji title! 🦄'
    );
  });
});
