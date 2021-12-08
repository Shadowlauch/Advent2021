import {readFileLines} from '../utils';


(async () => {
  const regex = new RegExp(/(\d+),(\d+) -> (\d+),(\d+)/);
  const lines = await readFileLines<string>(__dirname + '/input.txt');
  const coords = lines.map(l => {
    const [, x1, y1, x2, y2] = l.match(regex);
    return {x1: parseInt(x1), y1: parseInt(y1), x2: parseInt(x2), y2: parseInt(y2)};
  });

  const coords1 = coords.filter(c => c.x1 === c.x2 || c.y1 === c.y2);

  const grid = new Map<string, number>();
  for (const line of coords1) {
    const variableAxis = line.x1 === line.x2 ? 'y' : 'x';
    // @ts-ignore
    const [start, end] = [line[variableAxis + '1'], line[variableAxis + '2']].sort((a, b) => a - b) as [number, number];

    for (let i = start; i <= end; i++) {
      const key = variableAxis === 'x' ? `${i}x${line.y1}` : `${line.x1}x${i}`;
      grid.set(key, (grid.get(key) ?? 0) + 1);
    }
  }

  console.log('Answer 1', Array.from(grid.values()).reduce((c, v) => c + (v >= 2 ? 1 : 0), 0));

  const coords2 = coords.filter(c => c.x1 !== c.x2 && c.y1 !== c.y2);

  for (const line of coords2) {
    const length = Math.abs(line.x1 - line.x2);
    const xDir = line.x1 > line.x2 ? -1 : 1;
    const yDir = line.y1 > line.y2 ? -1 : 1;

    for (let i = 0; i <= length; i++) {
      const key = `${line.x1 + (i * xDir)}x${line.y1 + (i * yDir)}`;
      grid.set(key, (grid.get(key) ?? 0) + 1);
    }
  }

  console.log('Answer 2', Array.from(grid.values()).reduce((c, v) => c + (v >= 2 ? 1 : 0), 0));
})();
