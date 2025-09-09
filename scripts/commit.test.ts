import fs from 'fs';
import { validateCommitMessage, runCLI } from './commit-validator';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';

vi.mock('fs');

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

describe('validateCommitMessage', (): void => {
  describe('Valid commit messages', (): void => {
    const validCases = [
      'feat(KAN123): add new feature',
      'fix(KAN42): resolve login issue',
      'refactor(KAN7): improve code structure',
      'docs(KAN15): update documentation',
      'style(KAN99): format code',
      'chore(KAN3): update dependencies',
      'test(KAN67): add unit tests',
      'test(KAN-107): add hooks',
    ];

    test.each(validCases)('should validate %s', (message): void => {
      const result = validateCommitMessage(message) as ValidationResult;
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Invalid format', (): void => {
    const invalidFormatCases = [
      'feat: add feature',
      'feat(KAN123)',
      'KAN123: add feature',
      'feat(KAN123). add feature',
      '',
      'random text',
    ];

    test.each(invalidFormatCases)(
      'should reject invalid format: %s',
      (message): void => {
        const result = validateCommitMessage(message) as ValidationResult;
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Неверный формат');
      }
    );
  });

  describe('Invalid scope', (): void => {
    const invalidScopeCases = [
      'feat(kan123): lowercase scope',
      'feat(Kan123): mixed case scope',
      'feat(123): numeric scope',
      'feat(INVALID): wrong format',
      'feat(KAN): missing numbers',
      'feat(KAN123A): extra characters',
      'feat(KAN): no number',
      'feat(KAN-): no number',
    ];

    test.each(invalidScopeCases)(
      'should reject invalid scope: %s',
      (message): void => {
        const result = validateCommitMessage(message) as ValidationResult;
        expect(result.valid).toBe(false);
        expect(result.errors.some((error) => error.length > 0)).toBe(true);
      }
    );
  });
});

describe('CLI functionality', (): void => {
  const mockExit = vi.fn();
  const mockConsoleError = vi.fn();
  const mockConsoleLog = vi.fn();

  beforeEach((): void => {
    global.process.exit = mockExit as never;
    global.console.error = mockConsoleError;
    global.console.log = mockConsoleLog;

    vi.clearAllMocks();
  });

  afterEach((): void => {
    vi.resetAllMocks();
  });

  test('should exit with code 0 for valid commit message', (): void => {
    vi.mocked(fs.readFileSync).mockReturnValue('feat(KAN123): valid message');

    runCLI('/tmp/commit-message');

    expect(mockExit).toHaveBeenCalledWith(0);
    expect(mockConsoleError).not.toHaveBeenCalled();
  });

  test('should exit with code 1 for invalid commit message', (): void => {
    vi.mocked(fs.readFileSync).mockReturnValue('invalid message');

    runCLI('/tmp/commit-message');

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalled();
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('📋 Примеры')
    );
  });
});
