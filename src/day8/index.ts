import {readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);

  /**
   * 2 -> 1
   * 3 -> 7
   * 4 -> 4
   * 5 -> 2, 3, 5
   * 6 -> 0, 6, 9
   * 7 -> 8
   */
  let simpleCount = 0;
  let advancedCount = 0;
  const simpleLengths = [2, 4, 3, 7];
  const patternOrder = [
    2, //1
    3, //7

  ];
  for (const line of lines) {
    const [patterns, outputs] = line.split(' | ').map(v => v.split(' '));

    patterns.sort((a, b) => a.length - b.length);
    const sPatterns = patterns.map(p => p.split(''))

    const one = sPatterns[0];
    const seven = sPatterns[1];
    const four = sPatterns[2];
    const eight = sPatterns[9];

    const right = one;
    const middleLeftTop = diff(right, four);
    const [three] = sPatterns.slice(3, 6).filter(i => i.includes(right[0]) && i.includes(right[1]));
    const topLeftBottom = diff([...seven, ...four], three);
    const topLeft = topLeftBottom.includes(middleLeftTop[0]) ? middleLeftTop[0] : middleLeftTop[1];
    const middle = middleLeftTop.filter(i => i !== topLeft)[0];

    const [two] = sPatterns.slice(3, 6).filter(i => i !== three && !i.includes(topLeft));
    const [five] = sPatterns.slice(3, 6).filter(i => i !== three && i !== two);
    const [zero] = sPatterns.slice(6, 9).filter(i => !i.includes(middle));
    const [six] = sPatterns.slice(6, 9).filter(i => i !== zero && (!i.includes(right[0]) || !i.includes(right[1])));
    const [nine] = sPatterns.slice(6, 9).filter(i => i !== zero && i !== six);

    const numbers = [zero, one, two, three, four, five, six, seven, eight, nine];
    let outputString = '';
    for (const output of outputs) {
      const outArr = output.split('');
      if (simpleLengths.includes(output.length)) simpleCount++;

      outputString += numbers.findIndex(n => diff(n, outArr).length === 0);
    }
    advancedCount += parseInt(outputString);
  }

  console.log('Answer 1', simpleCount);
  console.log('Answer 2', advancedCount);
}


function diff(arr1: string[], arr2: string[]) {
  return arr1.filter(function(v){ return arr2.indexOf(v) < 0;}).concat(arr2.filter(function(v){ return arr1.indexOf(v) < 0;}));
}
