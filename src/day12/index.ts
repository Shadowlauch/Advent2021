import {readFileLines} from '../utils';

interface Cave {
  name: string;
  small: boolean;
  neighbours: Cave[];
}

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);
  let caves = new Map<string, Cave>();

  for (const line of lines) {
    const [, caveNameA, caveNameB] = line.match(/([a-zA-Z]+)-([a-zA-Z]+)/);

    for (const caveName of [caveNameA, caveNameB]) {
      if (!caves.has(caveName)) {
        caves.set(caveName, {
          name: caveName,
          neighbours: [],
          small: caveName.match(/[a-z]+/) !== null
        })
      }
    }

    const caveA = caves.get(caveNameA);
    const caveB = caves.get(caveNameB);

    caveA.neighbours.push(caveB);
    caveB.neighbours.push(caveA);
  }

  const stack = [[caves.get('start')]];
  let count = 0;
  while(stack.length > 0) {
    const currentRoute = stack.pop();
    const lastCave = currentRoute[currentRoute.length - 1];
    if (lastCave.name === 'end') {
      count++;
      //console.log(currentRoute.map(c => c.name));
      continue;
    }
    const neighbours = lastCave.neighbours.filter(c => (!c.small || !currentRoute.includes(c)) && c.name !== 'start');

    for (const neighbour of neighbours) {
      stack.push([...currentRoute, neighbour]);
    }
  }

  console.log('Answer 1', count)


  const stack2 = [[caves.get('start')]];
  let count2 = 0;
  while(stack2.length > 0) {
    const currentRoute = stack2.pop();
    const lastCave = currentRoute[currentRoute.length - 1];
    if (lastCave.name === 'end') {
      count2++;
      //console.log(currentRoute.map(c => c.name));
      continue;
    }

    for (const neighbour of lastCave.neighbours) {
      if (neighbour.name === "start") continue;
      const newRoute = [...currentRoute, neighbour];
      const smallAmounts = Object.values(newRoute.filter(c => c.small).reduce((a, c) => ({...a, [c.name]: (a[c.name] ?? 0) + 1}), {} as any)) as number[];

      if (smallAmounts.filter(c => c > 1).length <= 1 && Math.max(...smallAmounts) <= 2) {
        stack2.push(newRoute);
      }
    }
  }

  console.log('Answer 2', count2)
}
