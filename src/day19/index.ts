import {readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);

  let scannerIndex = 0;
  const scanners: [number, number, number][][] = [];
  for (const line of lines) {
    const scannerLine = line.match(/--- scanner ([0-9]+) ---/);


    if (scannerLine !== null) {
      scannerIndex = parseInt(scannerLine[1]);
      scanners[scannerIndex] = [];
    } else {
      scanners[scannerIndex].push(line.split(',').map(v => parseInt(v)) as [number, number, number]);
    }
  }

  const getAllOrientations = ([x, y, z]: [number, number, number]): [number, number, number][] => {
    return [
      [x, y, z], [x * -1, y, z], [x * -1, y * -1, z], [x, y * -1, z * -1], [x * -1, y, z * -1], [x, y, z * -1], [x * -1, y * -1, z * -1], [x, y * -1, z],
      [y, x, z], [y * -1, x, z], [y * -1, x * -1, z], [y, x * -1, z * -1], [y * -1, x, z * -1], [y, x, z * -1], [y * -1, x * -1, z * -1], [y, x * -1, z],
      [y, z, x], [y * -1, z, x], [y * -1, z * -1, x], [y, z * -1, x * -1], [y * -1, z, x * -1], [y, z, x * -1], [y * -1, z * -1, x * -1], [y, z * -1, x],
      [z, y, x], [z * -1, y, x], [z * -1, y * -1, x], [z, y * -1, x * -1], [z * -1, y, x * -1], [z, y, x * -1], [z * -1, y * -1, x * -1], [z, y * -1, x],
      [z, x, y], [z * -1, x, y], [z * -1, x * -1, y], [z, x * -1, y * -1], [z * -1, x, y * -1], [z, x, y * -1], [z * -1, x * -1, y * -1], [z, x * -1, y],
      [x, z, y], [x * -1, z, y], [x * -1, z * -1, y], [x, z * -1, y * -1], [x * -1, z, y * -1], [x, z, y * -1], [x * -1, z * -1, y * -1], [x, z * -1, y],
    ];
  };

  const scannerPositions: [number, number, number][] = [[0, 0, 0]];
  const beacons = scanners[0];
  scanners.splice(0, 1);
  outer: while(scanners.length > 0) {
    for (const [innerIndex, innerScanner] of scanners.entries()) {
      for (let l = 0; l < 48; l++) {
        const differenceMatrices = new Map<string, number>();
        for (const innerBeacon of innerScanner) {
          const [ix, iy, iz] = getAllOrientations(innerBeacon)[l];
          for (const [ox, oy, oz] of beacons) {
            const d = [ox - ix, oy - iy, oz - iz] as [number, number, number];
            const count = differenceMatrices.get(d.join('|')) ?? 0;
            differenceMatrices.set(d.join('|'), count + 1);

            if (count >= 11) {
              for (const innerBeacon of innerScanner) {
                const [ix, iy, iz] = getAllOrientations(innerBeacon)[l];
                const beacon = [ix + d[0], iy + d[1], iz + d[2]] as [number, number, number];
                if (!beacons.find(b => b[0] === beacon[0] && b[1] === beacon[1] && b[2] === beacon[2])) {
                  beacons.push(beacon);
                }
              }
              scannerPositions.push(d);
              scanners.splice(innerIndex, 1);
              continue outer;
            }
          }
        }
      }
    }
  }

  let longestDistance = 0;
  for (const [i, [x1, y1, z1]] of scannerPositions.entries()) {
    for (const [x2, y2, z2] of scannerPositions.slice(i + 1)) {
      longestDistance = Math.max(longestDistance, Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2))
    }
  }

  console.log('Answer 1', beacons.length);
  console.log('Answer 2', longestDistance);
}
