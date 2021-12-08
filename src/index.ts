import {readdir, writeFile, mkdir, copyFile} from 'fs/promises';
import {join} from 'path';
import {Command} from 'commander';
import {execSync} from 'child_process';

(async () => {
  const dirs = await readdir(__dirname, {withFileTypes: true}).then(items => {
    return items.filter(i => i.isDirectory() && i.name.startsWith('day'))
      .sort((a, b) =>
        parseInt(b.name.replace('day', '')) -  parseInt(a.name.replace('day', '')))
  });

  const program = new Command();

  program
    .command('run [dir]')
    .option('-e, --example', 'run on example data')
    .action(async (dirArg, opts) => {
      const dir = dirArg ?? dirs[0].name;
      const isExample = opts.example ?? false;

      const module = await import(join(__dirname, dir, 'index.ts'));

      if (module.hasOwnProperty('default')) module.default(isExample ? 'example.txt' : 'input.txt');
    });

  program
    .command('create')
    .action(async () => {
      const newDir = `day${parseInt(dirs[0].name.replace('day', '')) + 1}`;
      await mkdir(join(__dirname, newDir));
      await copyFile(join(__dirname, 'utils', 'template.txt'), join(__dirname, newDir, 'index.ts'));
      await writeFile(join(__dirname, newDir, 'example.txt'), '');
      await writeFile(join(__dirname, newDir, 'input.txt'), '');

      execSync('git add .', {cwd: join(__dirname, newDir)});
    });

  program.parse();
})();


