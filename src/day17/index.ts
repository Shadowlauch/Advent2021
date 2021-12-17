import {readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);
  const [,tx1, tx2, ty1, ty2] = lines[0].match(/target area: x=([0-9]+)..([0-9]+), y=([-0-9]+)..([-0-9]+)/).map(v => parseInt(v));

  const hits = (vX: number, vY: number) => {
    let x = 0;
    let y = 0;

    let highestY = 0;
    while (y >= ty1 && x <= tx2) {
      x += vX;
      y += vY;

      if (vX !== 0) vX += vX > 0 ? -1 : 1;
      vY -= 1;
      highestY = Math.max(y, highestY);

      if (x >= tx1 && y >= ty1 && x <= tx2 && y <= ty2) return highestY;
    }

    return false;
  }

  let highestY = 0;
  let count = 0;
  for (let x = 0; x <= tx2; x++) {
    for (let y = ty1; y < ty1 * -1; y++) {
      const isHit = hits(x, y);
      if (isHit !== false) {
        highestY = Math.max(isHit, highestY);
        count++;
      }
    }
  }

  console.log('Answer 1', highestY);
  console.log('Answer 2', count);
}
