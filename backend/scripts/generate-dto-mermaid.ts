import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  buildDtoMermaidMarkdown,
  parseDtoClasses,
  resolveDtoSourceFiles,
} from './dto-mermaid/dto-mermaid.utils';

const backendRoot = path.resolve(__dirname, '..');
const outputPath = path.resolve(backendRoot, '../docs/mermaid-dto-class-diagram.md');

/**
 * Generates the DTO Mermaid markdown file from backend DTO sources.
 */
function generateDtoMermaidDiagram(): void {
  const sourceFiles = resolveDtoSourceFiles(backendRoot);
  const classes = parseDtoClasses(sourceFiles);
  const markdown = buildDtoMermaidMarkdown(backendRoot, new Date(), classes);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, markdown, 'utf8');

  console.log(`Generated ${path.relative(backendRoot, outputPath)} (${classes.length} classes)`);
}

generateDtoMermaidDiagram();
