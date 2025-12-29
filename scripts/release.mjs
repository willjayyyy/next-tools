import { $, argv } from 'zx';
import { consola } from 'consola';
import semver from 'semver';
import { rawCommitsToMarkdown } from './shared/commits.mjs';
import { addToChangelog } from './shared/changelog.mjs';
import process from 'node:process';

$.verbose = false;

const isDryRun = argv['dry-run'] ?? argv._.includes('--dry-run');
const isYes = argv.y || argv.yes || argv._.includes('-y') || argv._.includes('--yes');

// Parse bump type from positional arguments
let bumpTypeArg;
const bumpIndex = argv._.indexOf('--bump');
if (bumpIndex !== -1 && bumpIndex + 1 < argv._.length) {
  bumpTypeArg = argv._[bumpIndex + 1];
}

// Get current version
const packageJson = await $`cat package.json`;
const packageData = JSON.parse(packageJson.stdout);
const currentVersion = packageData.version;

consola.info(`Current version: ${currentVersion}`);

// Get commit history
let rawCommits;

try {
  const result = await $`git log --pretty=oneline $(git describe --tags --abbrev=0)..HEAD`;
  rawCommits = result.stdout;
} catch {
  // If no previous tag found, check if there are any commits at all
  const result = await $`git log --pretty=oneline --oneline -1 2>/dev/null || echo ""`;
  rawCommits = result.stdout;
}

// Filter out empty lines and invalid commit lines
const validCommits = rawCommits
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && line.match(/^[a-f0-9]{7,}/)) // Must start with commit hash
  .join('\n');

if (!validCommits) {
  consola.error('No new commits found since last release');
  consola.info('Please make some commits before running release');
  process.exit(1);
}

const markdown = rawCommitsToMarkdown({ rawCommits: validCommits });

consola.info(`Changelog: \n\n${markdown}\n\n`);

if (isDryRun) {
  consola.info(`[dry-run] Auto-confirm: ${isYes ? 'enabled' : 'disabled'}`);
  consola.info(`[dry-run] Not creating version nor tag`);
  consola.info('Aborting');
  process.exit(0);
}

// Version bump type selection
let bumpType = bumpTypeArg;

if (!bumpType) {
  // Check if running in TTY environment
  if (process.stdout.isTTY) {
    bumpType = await consola.prompt('Select version bump type:', {
      type: 'select',
      options: [
        { value: 'patch', label: 'Patch (1.0.0 → 1.0.1) - Bug fixes' },
        { value: 'minor', label: 'Minor (1.0.0 → 1.1.0) - New features' },
        { value: 'major', label: 'Major (1.0.0 → 2.0.0) - Breaking changes' },
      ],
    });
  } else {
    // Non-interactive environment, default to patch version
    consola.warn('Non-interactive environment detected, using patch version by default');
    consola.warn('Use --bump patch|minor|major to specify version type');
    bumpType = 'patch';
  }
} else {
  consola.info(`Using bump type from arguments: ${bumpType}`);
}

// Validate bumpType
const validTypes = ['patch', 'minor', 'major'];
if (!validTypes.includes(bumpType)) {
  consola.error(`Invalid bump type: ${bumpType}. Must be one of: ${validTypes.join(', ')}`);
  process.exit(1);
}

// Calculate new version
const newVersion = semver.inc(currentVersion, bumpType);

if (!newVersion) {
  consola.error(`Failed to increment version ${currentVersion} with type ${bumpType}`);
  process.exit(1);
}

consola.info(`Bump type: ${bumpType}`);
consola.info(`New version will be: ${newVersion}`);

if (!isYes) {
  const shouldContinue = await consola.prompt(
    `This will create version ${newVersion} and update the changelog. Continue?`,
    {
      type: 'confirm',
    },
  );

  if (!shouldContinue) {
    consola.info('Aborting');
    process.exit(0);
  }
} else {
  consola.info('Auto-confirm enabled, proceeding with release...');
}

consola.info('Updating changelog');
await addToChangelog({ changelog: markdown, version: newVersion });
consola.success('Changelog updated');

try {
  consola.info('Committing changelog changes');
  await $`git add CHANGELOG.md`;
  await $`git commit -m "docs(changelog): update changelog for ${newVersion}"`;
  consola.success('Changelog changes committed');

  consola.info('Creating version and tag');
  await $`npm version ${newVersion} -m "chore(version): release ${newVersion}"`;
  consola.info(`Version ${newVersion} released with tag v${newVersion}`);
} catch (err) {
  consola.error(err);
  consola.info('Aborting');
  process.exit(1);
}
