import * as fs from 'node:fs';
import * as path from 'node:path';
import ts from 'typescript';

export const DTO_WATCH_PATHS = [
  'src/common/dto',
  'src/features/health/health-response.dto.ts',
] as const;

export interface DtoClassInfo {
  name: string;
  isAbstract: boolean;
  filePath: string;
  extendsName?: string;
  extendsViaPartialType?: boolean;
  properties: string[];
}

export interface DtoDiagramSection {
  title: string;
  classes: DtoClassInfo[];
}

/**
 * Recursively collects `.ts` files from a directory.
 */
export function collectTypeScriptFiles(rootDir: string, directory: string): string[] {
  const absoluteDir = path.join(rootDir, directory);
  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  const stat = fs.statSync(absoluteDir);
  if (stat.isFile() && absoluteDir.endsWith('.ts')) {
    return [absoluteDir];
  }

  if (!stat.isDirectory()) {
    return [];
  }

  return fs.readdirSync(absoluteDir).flatMap((entry) => {
    const entryPath = path.join(absoluteDir, entry);
    const entryStat = fs.statSync(entryPath);
    if (entryStat.isDirectory()) {
      return collectTypeScriptFiles(rootDir, path.join(directory, entry));
    }
    return entry.endsWith('.ts') ? [entryPath] : [];
  });
}

/**
 * Resolves all DTO source files that should appear in the diagram.
 */
export function resolveDtoSourceFiles(rootDir: string): string[] {
  const files = DTO_WATCH_PATHS.flatMap((watchPath) =>
    collectTypeScriptFiles(rootDir, watchPath),
  );

  return [...new Set(files)].sort((left, right) => left.localeCompare(right));
}

/**
 * Parses exported DTO classes from TypeScript source files.
 */
export function parseDtoClasses(sourceFiles: string[]): DtoClassInfo[] {
  const program = ts.createProgram(sourceFiles, {
    target: ts.ScriptTarget.ES2023,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    skipLibCheck: true,
    noEmit: true,
  });

  const classes: DtoClassInfo[] = [];

  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.isDeclarationFile || !sourceFiles.includes(sourceFile.fileName)) {
      continue;
    }

    ts.forEachChild(sourceFile, (node) => {
      if (!ts.isClassDeclaration(node) || !node.name) {
        return;
      }

      const modifiers = ts.getCombinedModifierFlags(node);
      if ((modifiers & ts.ModifierFlags.Export) === 0) {
        return;
      }

      classes.push({
        name: node.name.text,
        isAbstract: (modifiers & ts.ModifierFlags.Abstract) !== 0,
        filePath: sourceFile.fileName,
        extendsName: getExtendsName(node),
        extendsViaPartialType: isPartialTypeExtension(node),
        properties: getClassProperties(node, sourceFile),
      });
    });
  }

  return classes.sort((left, right) => left.name.localeCompare(right.name));
}

/**
 * Groups DTO classes by top-level domain folder for sectioned diagrams.
 */
export function groupClassesByDomain(
  rootDir: string,
  classes: DtoClassInfo[],
): DtoDiagramSection[] {
  const sections = new Map<string, DtoClassInfo[]>();

  for (const dtoClass of classes) {
    const relativePath = path.relative(rootDir, dtoClass.filePath);
    const sectionTitle = resolveSectionTitle(relativePath);
    const sectionClasses = sections.get(sectionTitle) ?? [];
    sectionClasses.push(dtoClass);
    sections.set(sectionTitle, sectionClasses);
  }

  return [...sections.entries()]
    .map(([title, sectionClasses]) => ({
      title,
      classes: sectionClasses.sort((left, right) => left.name.localeCompare(right.name)),
    }))
    .sort((left, right) => left.title.localeCompare(right.title));
}

/**
 * Builds a Mermaid class diagram for the provided DTO classes.
 */
export function buildMermaidClassDiagram(classes: DtoClassInfo[]): string {
  const classMap = new Map(classes.map((dtoClass) => [dtoClass.name, dtoClass]));
  const lines = ['classDiagram', '    direction TB', ''];

  for (const dtoClass of classes) {
    const displayProperties = resolveDisplayProperties(dtoClass, classMap);
    lines.push(`    class ${dtoClass.name} {`);
    if (displayProperties.length === 0) {
      lines.push('    }');
      lines.push('');
      continue;
    }

    for (const property of displayProperties) {
      lines.push(`        ${property}`);
    }
    lines.push('    }');
    lines.push('');
  }

  for (const dtoClass of classes) {
    if (!dtoClass.extendsName || !classMap.has(dtoClass.extendsName)) {
      continue;
    }
    lines.push(`    ${dtoClass.extendsName} <|-- ${dtoClass.name}`);
  }

  for (const dtoClass of classes) {
    for (const property of dtoClass.properties) {
      const compositionTarget = extractCompositionTarget(property);
      if (compositionTarget && classMap.has(compositionTarget)) {
        lines.push(`    ${dtoClass.name} *-- ${compositionTarget}`);
      }
    }
  }

  return `${lines.join('\n').trim()}\n`;
}

/**
 * Expands a section class list with inheritance ancestors and composition targets.
 */
export function expandClassesWithReferences(
  sectionClasses: DtoClassInfo[],
  allClasses: DtoClassInfo[],
): DtoClassInfo[] {
  const classMap = new Map(allClasses.map((dtoClass) => [dtoClass.name, dtoClass]));
  const names = new Set(sectionClasses.map((dtoClass) => dtoClass.name));

  const addWithAncestors = (className: string | undefined): void => {
    let current = className;
    while (current && classMap.has(current)) {
      if (names.has(current)) {
        current = classMap.get(current)?.extendsName;
        continue;
      }
      names.add(current);
      current = classMap.get(current)?.extendsName;
    }
  };

  for (const dtoClass of sectionClasses) {
    addWithAncestors(dtoClass.extendsName);
    for (const property of dtoClass.properties) {
      addWithAncestors(extractCompositionTarget(property));
    }
  }

  return allClasses
    .filter((dtoClass) => names.has(dtoClass.name))
    .sort((left, right) => left.name.localeCompare(right.name));
}

/**
 * Builds the auto-generated markdown document for DTO diagrams.
 */
export function buildDtoMermaidMarkdown(
  rootDir: string,
  generatedAt: Date,
  classes: DtoClassInfo[],
): string {
  const sections = groupClassesByDomain(rootDir, classes);
  const lines = [
    '# DTO Mermaid Class Diagram',
    '',
    '> **Auto-generated.** Do not edit manually.',
    `> **Sources:** \`backend/${DTO_WATCH_PATHS.join('`, `backend/')}\``,
    `> **Generated at:** ${generatedAt.toISOString()}`,
    '> **Manual reference:** [schemas-design.md](./schemas-design.md) §4 (API JSON Schemas)',
    '',
    'Наследование (`<|--`), композиция (`*--`). Классы с префиксом `Abstract` — внутренние предки.',
    '',
    '---',
    '',
    '## Обзор',
    '',
    '```mermaid',
    buildMermaidClassDiagram(classes).trimEnd(),
    '```',
    '',
  ];

  for (const section of sections) {
    const sectionClasses = expandClassesWithReferences(section.classes, classes);
    lines.push(
      `## ${section.title}`,
      '',
      '```mermaid',
      buildMermaidClassDiagram(sectionClasses).trimEnd(),
      '```',
      '',
    );
  }

  return `${lines.join('\n').trim()}\n`;
}

function resolveSectionTitle(relativePath: string): string {
  if (relativePath.includes('features/health/')) {
    return 'Health';
  }

  const domainMatch = relativePath.match(/src[/\\]common[/\\]dto[/\\]([^/\\]+)/);
  if (!domainMatch) {
    return 'Other';
  }

  const domain = domainMatch[1];
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

function getExtendsName(node: ts.ClassDeclaration): string | undefined {
  const heritage = node.heritageClauses?.find(
    (clause) => clause.token === ts.SyntaxKind.ExtendsKeyword,
  );
  const type = heritage?.types[0]?.expression;
  if (!type) {
    return undefined;
  }

  if (ts.isIdentifier(type)) {
    return type.text;
  }

  if (!ts.isCallExpression(type) || !ts.isIdentifier(type.expression)) {
    return undefined;
  }

  const mixinName = type.expression.text;
  if (!['PartialType', 'PickType', 'OmitType'].includes(mixinName)) {
    return undefined;
  }

  const firstArgument = type.arguments[0];
  return firstArgument && ts.isIdentifier(firstArgument) ? firstArgument.text : undefined;
}

function isPartialTypeExtension(node: ts.ClassDeclaration): boolean {
  const heritage = node.heritageClauses?.find(
    (clause) => clause.token === ts.SyntaxKind.ExtendsKeyword,
  );
  const type = heritage?.types[0]?.expression;
  return (
    !!type &&
    ts.isCallExpression(type) &&
    ts.isIdentifier(type.expression) &&
    type.expression.text === 'PartialType'
  );
}

function resolveDisplayProperties(
  dtoClass: DtoClassInfo,
  classMap: Map<string, DtoClassInfo>,
): string[] {
  const chain: DtoClassInfo[] = [];
  let current: DtoClassInfo | undefined = dtoClass;

  while (current) {
    chain.unshift(current);
    current = current.extendsName ? classMap.get(current.extendsName) : undefined;
  }

  const properties = new Map<string, string>();
  for (const chainClass of chain) {
    for (const property of chainClass.properties) {
      const propertyName = property.match(/^\+([^:]+)/)?.[1];
      if (!propertyName) {
        continue;
      }

      let displayProperty = property;
      if (dtoClass.extendsViaPartialType && chainClass.name !== dtoClass.name) {
        displayProperty = property.replace(`+${propertyName}:`, `+${propertyName}?:`);
      }

      properties.set(propertyName, displayProperty);
    }
  }

  return [...properties.values()];
}

function getClassProperties(node: ts.ClassDeclaration, sourceFile: ts.SourceFile): string[] {
  const properties: string[] = [];

  for (const member of node.members) {
    if (!ts.isPropertyDeclaration(member) || !member.name || !ts.isIdentifier(member.name)) {
      continue;
    }

    const typeText = member.type ? member.type.getText(sourceFile) : 'unknown';
    properties.push(`+${member.name.text}: ${normalizeTypeText(typeText)}`);
  }

  return properties;
}

function normalizeTypeText(typeText: string): string {
  return typeText.replaceAll('[]', 'Array').replaceAll('!', '');
}

function extractCompositionTarget(property: string): string | undefined {
  const rawType = property.split(': ')[1];
  if (!rawType) {
    return undefined;
  }

  const baseType = rawType.replace(/Array$/, '');
  return /^[A-Z]/.test(baseType) ? baseType : undefined;
}
