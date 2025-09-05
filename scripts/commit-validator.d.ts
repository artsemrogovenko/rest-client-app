// commit-validator.d.ts
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export declare function validateCommitMessage(
  message: string
): ValidationResult;
export declare function runCLI(filePath: string): void;
