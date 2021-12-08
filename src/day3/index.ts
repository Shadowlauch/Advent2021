import {readFileLines} from '../utils';


(async () => {
  const lines = await readFileLines<string>(__dirname + '/input.txt');

  const difference: number[] = [];
  for (const line of lines) {
    for (let i = 0; i < line.split('').length; i++){
      const bit = line.split('')[i];

      difference[i] = (difference[i] ?? 0) + (bit === '1' ? 1 : -1);
    }
  }

  const gamma = parseInt(difference.map(v => v > 0 ? 1 : 0).join(''), 2);
  const epsilon = parseInt(difference.map(v => v < 0 ? 1 : 0).join(''), 2);

  console.log('Answer 1', gamma * epsilon);

  const calculate = (compareFn: (a: number, b: number) => boolean) => {
    let numbers = lines;
    for (let i = 0; i < difference.length; i++) {
      if (numbers.length === 1) break;

      const zero = [];
      const one = [];

      for (const number of numbers) {
        if (number[i] === '1') one.push(number);
        else zero.push(number);
      }

      if (compareFn(one.length, zero.length)) numbers = one;
      else numbers = zero
    }

    return parseInt(numbers[0], 2);
  }


  console.log('Answer 2', calculate((a, b) => a >= b) * calculate((a, b) => a < b));
})();
