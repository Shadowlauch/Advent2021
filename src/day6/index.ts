import {readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);
  const fish = lines[0].split(',').map(v => parseInt(v));
  const fishGroups = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  for (const fish1 of fish) {
    fishGroups[fish1]++;
  }

  for (let i = 1; i <= 256; i++) {
    const newFish = fishGroups.shift();
    fishGroups.push(newFish);
    fishGroups[6] += newFish;

    if (i === 80) console.log('Answer 1', fishGroups.reduce((c, v) => c + v, 0));
  }

  console.log('Answer 2', fishGroups.reduce((c, v) => c + v, 0))
}
