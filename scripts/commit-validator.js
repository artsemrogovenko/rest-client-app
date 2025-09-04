import fs from 'fs';
import { z } from 'zod';

const commitSchema = z.object({
  fullMessage: z.string(),
  type: z.enum(['feat', 'fix', 'refactor', 'docs', 'style', 'chore', 'test'], {
    refine: (val) => val !== undefined,
  }),
  scope: z
    .string()
    .regex(/^KAN\d+$/)
    .refine((scope) => scope === scope.toUpperCase()),
  subject: z
    .string()
    .min(1)
    .refine((val) => !val.endsWith('.'))
    .refine((val) => val === val.toLowerCase()),
});

function validateCommitMessage(message) {
  const result = {
    valid: false,
    errors: [],
  };

  const formatRegex = /^(\w+)\(([^)]+)\):\s(.+)$/;
  const match = message.match(formatRegex);

  if (!match) {
    result.errors.push(`Неверный формат`);
    return result;
  }

  const [, type, scope, subject] = match;

  try {
    commitSchema.parse({
      fullMessage: message,
      type,
      scope,
      subject,
    });

    result.valid = true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      result.errors = error.errors.map((err) => `🚫 ${err.message}`);
    } else {
      result.errors.push('Неизвестная ошибка');
    }
  }

  return result;
}

const commitFilePath = process.argv[2];
const commitMessage = fs.readFileSync(commitFilePath, 'utf-8').trim();

const validation = validateCommitMessage(commitMessage);

if (!validation.valid) {
  console.error('❌ Ошибка сообщения: ', commitMessage);
  console.log('\n📋 Примеры:');
  console.log(
    '   feat(KAN1): add user authentication\n' +
      '   fix(KAN42): resolve login issue'
  );
  process.exit(1);
}

process.exit(0);
