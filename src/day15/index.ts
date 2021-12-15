import {coordsToIndex, indexToCoords, readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);
  const gridMult = 5;
  const width = lines[0].length * gridMult;
  const height = lines.length * gridMult;

  const grid: number[] = [];
  for (let i = 0; i < gridMult; i++) {
    for (const line of lines) {
      for (let j = 0; j < gridMult; j++) {
        grid.push(...line.split('').map(v => {
          const int = parseInt(v) + i + j;
          return int > 9 ? int % 9 : int;
        }));
      }
    }
  }

  const distances = [0];
  let queue = [0];

  while (queue.length > 0) {
    const currentIndex = queue.shift();
    const [x, y] = indexToCoords(currentIndex, width);
    const neighbours = [[x, y - 1], [x - 1, y], [x, y + 1], [x + 1, y]];

    for (const [nX, nY] of neighbours) {
      if (nX < 0 || nY < 0 || nX >= width || nY >= height) continue;
      const neighbourIndex = coordsToIndex(nX, nY, width);

      const currentDistance = distances[currentIndex] + grid[neighbourIndex];
      if (distances[neighbourIndex] === undefined || currentDistance < distances[neighbourIndex]) {
        queue.push(neighbourIndex);
        distances[neighbourIndex] = currentDistance;
      }
    }
  }

  console.log('Answer 1', distances[width * ((height / gridMult) - 1) + (width / gridMult) - 1]);
  console.log('Answer 2', distances[distances.length - 1]);
}
