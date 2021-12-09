import {readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);

  const grid = lines.reduce((c, v) => [...c, ...v.split('').map(v => parseInt(v))], []);
  const width = lines[0].length;
  const height = lines.length;

  const indexToCoords = (i: number) => [i % width, Math.floor(i / width)];
  const coordsToIndex = (x: number, y: number) =>  y * width + x;

  const areaMatrix = [[-1, 0], [1, 0], [0, 1], [0, -1]];

  let lowPointSum = 0;
  const lowPoints: number[] = [];
  for (let i = 0; i < grid.length; i++){
    const [x, y] = indexToCoords(i);
    const isLow = areaMatrix.every(([dX, dY]) => {
      const nX = x + dX;
      const nY = y + dY;

      return nX < 0 || nX >= width || nY < 0 || nY >= height || grid[coordsToIndex(nX, nY)] > grid[i];
    });

    if (isLow){
      lowPointSum += 1 + grid[i];
      lowPoints.push(i);
    }
  }

  console.log('Answer 1', lowPointSum);

  const basins = [];
  for (const lowPoint of lowPoints) {
    const queue = [lowPoint];
    const basin = [lowPoint];
    while (queue.length > 0) {
      const pos = queue.shift();
      const [x, y] = indexToCoords(pos);

      for (const [dX, dY] of areaMatrix) {
        const nX = x + dX;
        const nY = y + dY;
        const nPos = coordsToIndex(nX, nY);

        if (nX < 0 || nX >= width || nY < 0 || nY >= height || grid[nPos] >= 9 || basin.includes(nPos)) continue;

        queue.push(nPos);
        basin.push(nPos);
      }
    }

    basins.push(basin);
  }

  console.log('Answer 1', basins.map(b => b.length).sort((a, b) => b - a).slice(0, 3).reduce((c, v) => c * v, 1));
}
