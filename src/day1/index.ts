import {readFileLines} from '../utils';


(async () => {
  const lines = await readFileLines<number>(__dirname + '/input.txt', (a) => parseInt(a));

  let prev = Number.MAX_SAFE_INTEGER;
  let largerCount = 0;

  for (const depth of lines) {
    if (depth > prev) largerCount++;
    prev = depth;
  }

  console.log('Answer 1', largerCount);

  largerCount = 0;
  for (let i = 3; i < lines.length; i++) {
    const prevWindow = lines[i - 1] + lines[i - 2] + lines[i - 3];
    const currentWindow = lines[i] + lines[i - 1] + lines[i - 2];

    if (currentWindow > prevWindow) largerCount++;
  }

  console.log('Answer 2', largerCount);

})()

