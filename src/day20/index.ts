import {coordsToIndex, indexToCoords, readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);

  const algorithm = lines[0].split('').map(v => v === '#' ? 1 : 0);

  const startImage: number[] = [];
  const startWidth = lines[1].length;
  for (const line of lines.slice(1)) {
    startImage.push(...line.split('').map(v => v === '#' ? 1 : 0));
  }

  const padImage = (image: number[], width: number, padding: number, infiniteValue: number) => {
    let col = Array(((padding * 2) + width) * padding).fill(infiniteValue);
    let paddedImage = [...col];
    for (let y = 0; y < image.length / width; y++) {
      const start = coordsToIndex(0, y, width);
      const end = coordsToIndex(width - 1, y, width);
      const add = Array(padding).fill(infiniteValue);
      paddedImage.push(...add, ...image.slice(start, end + 1), ...add);
    }
    paddedImage.push(...col);
    return paddedImage;
  }

  const printImage = (image: number[], width: number) => {
    let lastY = -1;
    for (let i = 0; i < image.length; i++) {
      const [, y] = indexToCoords(i, width);
      if (y !== lastY) {
        lastY = y;
        console.log('');
      }
      process.stdout.write(image[i] === 0 ? `.` : `#`);
    }
    console.log('')
  }

  const neighbours = (index: number, image: number[], width: number, infiniteValue: number) => {
    const matrix = [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    const [x, y] = indexToCoords(index, width);
    let bin = '';

    for (const [mx, my] of matrix) {
      const [nx, ny] = [x + mx, y + my];

      if (nx >= 0 && nx < width && ny >= 0 && ny < image.length / width) bin += image[coordsToIndex(nx, ny, width)];
      else bin += infiniteValue;
    }

    return parseInt(bin, 2);
  }

  let image = startImage;
  let width = startWidth;
  let infiniteValue = 0;
  for (let i = 0; i < 50; i++) {
    image = padImage(image, width, 1, infiniteValue);
    width += 2;
    let newImage: number[] = [];

    for (let j = 0; j < image.length; j++) {
      newImage.push(algorithm[neighbours(j, image, width, infiniteValue)])
    }

    image = newImage;
    infiniteValue = (infiniteValue + 1) % 2;

    if (i === 1) console.log('Answer 1', image.reduce((c, v) => c + v, 0));
  }

  printImage(image, width);

  console.log('Answer 2', image.reduce((c, v) => c + v, 0));
}
