import {readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);
  let polymer = lines[0];
  const reactions = new Map(lines.slice(1).map(v => v.split(' -> ') as [string, string]));

  for (let step = 0; step < 10; step++) {
    for (let i = 0; i < polymer.length - 1; i++) {
      const pair = polymer.slice(i, i + 2);
      const reaction = reactions.get(pair);

      if (!reaction) continue;

      polymer = polymer.slice(0, i + 1) + reaction + polymer.slice(i + 1);
      i++;
    }
  }

  const counts = Object.values(polymer.split('').reduce((c, v) => ({...c, [v]: (c[v] ?? 0) + 1}), {} as Record<string, number>));

  console.log('Answer 1', Math.max(...counts) - Math.min(...counts));

  const template = lines[0].split('');
  let pairCounts = new Map<string, bigint>();
  for (let i = 0; i < template.length - 1; i++){
    const name = `${template[i]}${template[i + 1]}`;
    pairCounts.set(name, (pairCounts.get(name) ?? 0n) + 1n);
  }

  for (let step = 0; step < 40; step++) {
    const newPairCounts = new Map(pairCounts);
    for (const [name, count] of pairCounts.entries()) {
      const reaction = reactions.get(name);
      const newPairs = [name[0] + reaction, reaction + name[1]];

      newPairCounts.set(name, newPairCounts.get(name) - count);

      for (const newPair of newPairs) {
        newPairCounts.set(newPair, (newPairCounts.get(newPair) ?? BigInt(0)) + count);
      }
    }

    pairCounts = newPairCounts;
  }

  const counts2: Record<string, bigint> = {}
  for (const [name, count] of pairCounts.entries()) {
    counts2[name[1]] = (counts2[name[1]] ?? 0n) + count;
  }
  counts2[template[0]] += 1n;
  const [min, max] = bigIntMinAndMax(...Object.values(counts2));

  console.log('Answer 2', max - min)
}

const bigIntMinAndMax = (...args: bigint[]) => {
  return args.reduce(([min,max], e) => {
    return [
      e < min ? e : min,
      e > max ? e : max,
    ];
  }, [args[0], args[0]]);
};

