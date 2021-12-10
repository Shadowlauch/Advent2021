import {readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);

  const open = ['(', '[', '{', '<'];
  const close = [')', ']', '}', '>'];
  const points = [3, 57, 1197, 25137];

  let corruptedPoints = 0;
  const autocompleteScores = [];
  outer: for (const line of lines) {
    const stack = [];

    for (const char of line.split('')) {
      const openIndex = open.indexOf(char);
      const closeIndex = close.indexOf(char);

      if (openIndex !== -1) {
        stack.push(close[openIndex]);
      } else if (closeIndex !== -1) {
        const last = stack.pop();
        if (last !== char) {
          corruptedPoints += points[closeIndex];
          continue outer;
        }
      }
    }

    const reversedStack = stack.reverse();
    let currentPoints = 0;
    for (const char of reversedStack) {
      const openIndex = close.indexOf(char);
      currentPoints = (currentPoints * 5) + (openIndex + 1);
    }

    autocompleteScores.push(currentPoints);
  }

  console.log('Answer 1', corruptedPoints);
  console.log('Answer 2', autocompleteScores.sort((a, b) => a - b)[Math.floor(autocompleteScores.length / 2)]);
}
