import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { process } from 'node:process';

const currentDirname = dirname(fileURLToPath(import.meta.url));

const toolsDir = join(currentDirname, '..', 'src', 'tools');
 
const toolName = process.argv[2];

if (!toolName) {
  throw new Error('Please specify a toolname.');
}

const toolNameCamelCase = toolName.replace(/-./g, (x) => x[1].toUpperCase());
const toolNameTitleCase = toolName[0].toUpperCase() + toolName.slice(1).replace(/-/g, ' ');
const toolDir = join(toolsDir, toolName);

await mkdir(toolDir);
console.log(`Directory created: ${toolDir}`);

const createToolFile = async (name, content) => {
  const filePath = join(toolDir, name);
  await writeFile(filePath, content.trim());
  console.log(`File created: ${filePath}`);
};

createToolFile(
  `${toolName}.vue`,
  `
<template>
  <div>
    Lorem ipsum
  </div>
</template>

<script setup lang="ts">

</script>
`,
);

createToolFile(
  `index.ts`,
  `
import { Wrench } from 'lucide-vue-next';
import { defineTool } from '../tool';

export const tool = defineTool({
  key: '${toolName}',
  name: '${toolNameTitleCase}',
  path: '/${toolName}',
  description: '',
  keywords: ['${toolName.split('-').join("', '")}'],
  component: () => import('./${toolName}.vue'),
  icon: Wrench,
  createdAt: new Date('${new Date().toISOString().split('T')[0]}'),
});
`,
);

createToolFile(`${toolName}.service.ts`, ``);
createToolFile(
  `${toolName}.service.test.ts`,
  `
import { expect, describe, it } from 'vitest';
// import { } from './${toolName}.service';
//
// describe('${toolName}', () => {
//
// })
`,
);

createToolFile(
  `${toolName}.e2e.spec.ts`,
  `
import { test, expect } from '@playwright/test';

test.describe('Tool - ${toolNameTitleCase}', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/${toolName}');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('${toolNameTitleCase} - Next Tools');
  });

  test('', async ({ page }) => {

  });
});
  
`,
);

const toolsIndex = join(toolsDir, 'index.ts');
const indexContent = await readFile(toolsIndex, { encoding: 'utf-8' }).then((r) => r.split('\n'));

indexContent.splice(3, 0, `import { tool as ${toolNameCamelCase} } from './${toolName}';`);
writeFile(toolsIndex, indexContent.join('\n'));
console.log(`Added import in: ${toolsIndex}`);
