import {coordsToIndex, indexToCoords, readFileLines} from '../utils';

const width = 10;

const getNeighbouringIndices = (i: number) => {
  const matrix = [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1], [0, 1], [0, -1]];
  const [x, y] = indexToCoords(i, width);
  return matrix.map(([dX, dY]) => [x + dX, y + dY]).filter(([nX, nY]) => nX >= 0 && nX < width && nY >= 0 && nY < width).map((p) => coordsToIndex(p[0], p[1], width));
}

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);
  let grid = lines.reduce((c, l) => [...c, ...l.split('').map(i => parseInt(i))], []) as number[];

  let flashCount = 0;
  let allFlashIndex: number | null = null;
  for (let i = 0; i < 100000; i++) {
    grid = grid.map(v => v + 1);

    let anyFlash = true;
    while(anyFlash) {
      anyFlash = false;
      for (const [index, value] of grid.entries()) {
        if (value > 9) {
          if (i <= 100) flashCount++;

          grid[index] = 0;
          for (const neighbouringIndex of getNeighbouringIndices(index)) {
            if (grid[neighbouringIndex] === 9) anyFlash = true;

            if (grid[neighbouringIndex] !== 0) {
              grid[neighbouringIndex] += 1;
            }
          }
        }
      }
    }

    if (grid.every(v => v === 0)) {
      allFlashIndex = i;
      break;
    }
  }

  console.log('Answer 1', flashCount);
  console.log('Answer 2', allFlashIndex + 1);
}
