import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildDtoMermaidMarkdown,
  buildMermaidClassDiagram,
  expandClassesWithReferences,
  parseDtoClasses,
  resolveDtoSourceFiles,
} from './dto-mermaid.utils';

const tempDirs: string[] = [];

afterEach(() => {
  for (const tempDir of tempDirs.splice(0)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

/**
 * Creates a temporary backend-like workspace for diagram generation tests.
 */
function createTempWorkspace(files: Record<string, string>): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dto-mermaid-'));
  tempDirs.push(tempDir);

  for (const [relativePath, content] of Object.entries(files)) {
    const absolutePath = path.join(tempDir, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, content);
  }

  return tempDir;
}

describe('dto-mermaid.utils', () => {
  it('parses inheritance and properties from DTO classes', () => {
    const rootDir = createTempWorkspace({
      'src/common/dto/user/abstract-user-credentials.dto.ts': `
        export abstract class AbstractUserCredentialsDto {
          firebaseUid!: string;
          email!: string;
        }
      `,
      'src/common/dto/user/create-user.dto.ts': `
        import { AbstractUserCredentialsDto } from './abstract-user-credentials.dto';

        export class CreateUserDto extends AbstractUserCredentialsDto {}
      `,
      'src/common/dto/library/submit-quiz-attempt-request.dto.ts': `
        import { SubmitQuizAnswerDto } from './submit-quiz-answer.dto';

        export class SubmitQuizAttemptRequestDto {
          answers!: SubmitQuizAnswerDto[];
        }
      `,
      'src/common/dto/library/submit-quiz-answer.dto.ts': `
        export class SubmitQuizAnswerDto {
          questionId!: string;
          selectedOptionIndex!: number;
        }
      `,
    });

    const sourceFiles = resolveDtoSourceFiles(rootDir);
    const classes = parseDtoClasses(sourceFiles);

    expect(classes.map(({ name }) => name)).toEqual([
      'AbstractUserCredentialsDto',
      'CreateUserDto',
      'SubmitQuizAnswerDto',
      'SubmitQuizAttemptRequestDto',
    ]);
    expect(classes.find(({ name }) => name === 'CreateUserDto')?.extendsName).toBe(
      'AbstractUserCredentialsDto',
    );
    expect(buildMermaidClassDiagram(classes)).toContain(
      'AbstractUserCredentialsDto <|-- CreateUserDto',
    );
    expect(buildMermaidClassDiagram(classes)).toContain(
      'SubmitQuizAttemptRequestDto *-- SubmitQuizAnswerDto',
    );
  });

  it('parses PartialType inheritance and inherited properties', () => {
    const rootDir = createTempWorkspace({
      'src/common/dto/user/abstract-user-credentials.dto.ts': `
        export abstract class AbstractUserCredentialsDto {
          firebaseUid!: string;
          email!: string;
        }
      `,
      'src/common/dto/user/create-user.dto.ts': `
        import { AbstractUserCredentialsDto } from './abstract-user-credentials.dto';

        export class CreateUserDto extends AbstractUserCredentialsDto {}
      `,
      'src/common/dto/user/update-user.dto.ts': `
        import { PartialType } from '@nestjs/swagger';
        import { CreateUserDto } from './create-user.dto';

        export class UpdateUserDto extends PartialType(CreateUserDto) {}
      `,
    });

    const classes = parseDtoClasses(resolveDtoSourceFiles(rootDir));
    const updateUser = classes.find(({ name }) => name === 'UpdateUserDto');

    expect(updateUser?.extendsName).toBe('CreateUserDto');
    expect(updateUser?.extendsViaPartialType).toBe(true);
    expect(buildMermaidClassDiagram(classes)).toContain('CreateUserDto <|-- UpdateUserDto');
    expect(buildMermaidClassDiagram(classes)).toContain('+firebaseUid?: string');
    expect(buildMermaidClassDiagram(classes)).toContain('+email?: string');
  });

  it('includes ancestor and composition classes in section diagrams', () => {
    const rootDir = createTempWorkspace({
      'src/common/dto/shared/quiz-question.dto.ts': `
        export class QuizQuestionDto {
          question!: string;
        }
      `,
      'src/common/dto/library/library-quiz-detail.dto.ts': `
        import { QuizQuestionDto } from '../shared/quiz-question.dto';

        export class LibraryQuizDetailDto {
          questions!: QuizQuestionDto[];
        }
      `,
    });

    const classes = parseDtoClasses(resolveDtoSourceFiles(rootDir));
    const librarySection = expandClassesWithReferences(
      classes.filter(({ filePath }) => filePath.includes('/library/')),
      classes,
    );

    expect(librarySection.map(({ name }) => name)).toEqual([
      'LibraryQuizDetailDto',
      'QuizQuestionDto',
    ]);
    expect(buildMermaidClassDiagram(librarySection)).toContain(
      'LibraryQuizDetailDto *-- QuizQuestionDto',
    );
  });

  it('builds markdown with overview and section diagrams', () => {
    const rootDir = createTempWorkspace({
      'src/common/dto/auth/auth-user.dto.ts': `
        export class AuthUserDto {
          email!: string;
        }
      `,
      'src/features/health/health-response.dto.ts': `
        export class HealthResponseDto {
          status!: string;
        }
      `,
    });

    const classes = parseDtoClasses(resolveDtoSourceFiles(rootDir));
    const markdown = buildDtoMermaidMarkdown(rootDir, new Date('2026-06-15T00:00:00.000Z'), classes);

    expect(markdown).toContain('# DTO Mermaid Class Diagram');
    expect(markdown).toContain('## Auth');
    expect(markdown).toContain('## Health');
    expect(markdown).toContain('class AuthUserDto');
    expect(markdown).toContain('class HealthResponseDto');
  });
});
