import { readFile } from 'node:fs/promises';

const changelogContent = await readFile('./CHANGELOG.md', 'utf-8');
const [, lastChangelog] = changelogContent.split(/^## .*$/gm);

console.log(lastChangelog.trim());
