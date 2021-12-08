import {readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);
  const crabPositions = lines[0].split(',').map(v => parseInt(v));

  const sorted = [...crabPositions].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  let minFuel = Number.MAX_SAFE_INTEGER;
  let minFuel2 = Number.MAX_SAFE_INTEGER;

  for (let i = min; i <= max; i++) {
    let fuel = 0;
    let fuel2 = 0;
    for (const crabPosition of crabPositions) {
      const diff = Math.abs(crabPosition - i);
      fuel += diff;
      fuel2 += (diff * (diff + 1)) / 2;
    }

    if (fuel < minFuel) minFuel = fuel;
    if (fuel2 < minFuel2) minFuel2 = fuel2;
  }

  console.log('Answer 1', minFuel)
  console.log('Answer 2', minFuel2)
}
