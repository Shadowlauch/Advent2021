import {readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);

  const dots: ([number, number] | null)[] = [];
  const folds: [string, number][] = [];

  for (const line of lines) {
    if (line.length < 2) continue;

    if (line.startsWith('fold')) {
      const [axis, pos] = line.replace('fold along ', '').split('=');
      folds.push([axis, parseInt(pos)]);
    } else {
      const [x, y] = line.split(',');
      dots.push([parseInt(x), parseInt(y)]);
    }
  }

  let answer1;
  for (const [axis, pos] of folds) {
    const axisIndex = axis === 'x' ? 0 : 1;

    for (const [i, dotPos] of dots.entries()) {
      if (dotPos === null) continue;

      const axisPos = dotPos[axisIndex];

      if (axisPos < pos) continue;

      const newAxisPos = axisPos - ((axisPos - pos) * 2);
      const newDotPos: [number, number] = axis === 'x' ? [newAxisPos, dotPos[1]] : [dotPos[0], newAxisPos];

      if (dots.find(p => p && p[0] === newDotPos[0] && p[1] === newDotPos[1]) || newAxisPos < 0) {
        dots[i] = null;
      } else {
        dots[i] = newDotPos;
      }
    }

    if (!answer1) answer1 = dots.filter(i => i).length;
  }


  let width = 0;
  let height = 0;
  for (const [x, y] of dots.filter(c => c)) {
    width = Math.max(x, width);
    height = Math.max(y, height);
  }

  console.log('Answer 1', answer1);

  for (let y = 0; y <= height; y++) {
    for (let x = 0; x <= width; x++) {
      const isDot = dots.find(p => p && p[0] === x && p[1] === y);
      process.stdout.write(isDot ? '#' : '.');
    }
    process.stdout.write('\n');
  }

}
