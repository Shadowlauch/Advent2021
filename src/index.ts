import {readdir} from 'fs/promises';
import {join} from 'path';

(async () => {
  const dirs = await readdir(__dirname, {withFileTypes: true}).then(items => {
    return items.filter(i => i.isDirectory() && i.name.startsWith('day'))
      .sort((a, b) =>
        parseInt(b.name.replace('day', '')) -  parseInt(a.name.replace('day', '')))
  });
  const dir = process.argv[2] ?? dirs[0].name;

  import(join(__dirname, dir, 'index.ts'));
})();


