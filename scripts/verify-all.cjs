const { spawnSync } = require('node:child_process');

const npmCli = process.env.npm_execpath;
if (!npmCli) {
  console.error('npm_execpath is not set; run this script through npm.');
  process.exit(1);
}

const commands = [
  [process.execPath, [npmCli, 'run', 'verify:schemas']],
  [process.execPath, [npmCli, 'run', 'test']],
  [process.execPath, [npmCli, 'run', 'verify:publication-safety']],
];

for (const [command, args] of commands) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

