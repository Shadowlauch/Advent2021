import {readFileLines} from '../utils';

const hex2bin = (hex: string) => (parseInt(hex, 16).toString(2)).padStart(4, '0');

export default async function (fileName: string) {
  const instructions = await readFileLines<string>(__dirname + '/' + fileName, (v: string) => v.split('').map(v => hex2bin(v)).join(''));

  let versionSum = 0;
  const runInstructions = (instruction: string): [number, number] => {
    const current = instruction.slice(0);
    const version = parseInt(current.slice(0, 3), 2);
    versionSum += version;
    const type = parseInt(current.slice(3, 6), 2);

    if (type === 4) {
      const parts = current.slice(6);
      let bin = '';
      for (let i = 0; i < Math.floor(parts.length / 5); i++) {
        const start = i * 5;
        const currentPart = parts.slice(start, start + 5);
        bin += currentPart.slice(1);

        if (currentPart.startsWith('0')) return [parseInt(bin, 2), start + 5 + 6];
      }
    } else {
      const lengthType = parseInt(current.slice(6, 7));
      let pointer;
      const values = [];

      if (lengthType === 0) {
        pointer = 22;
        const lengthValue = parseInt(current.slice(7, pointer), 2) + pointer;
        while (pointer < lengthValue) {
          const [value, newPointer] = runInstructions(current.slice(pointer));
          pointer += newPointer;
          values.push(value);
        }
      } else {
        pointer = 18;
        const lengthValue = parseInt(current.slice(7, pointer), 2);
        for (let i = 0; i < lengthValue; i++) {
          const [value, newPointer] = runInstructions(current.slice(pointer));
          pointer += newPointer;
          values.push(value);
        }
      }

      let value = 0;
      if (type === 0) value = values.reduce((c, v) => c + v, 0);
      else if (type === 1) value = values.reduce((c, v) => c * v, 1);
      else if (type === 2) value = Math.min(...values);
      else if (type === 3) value = Math.max(...values);
      else if (type === 5) value = values[0] > values[1] ? 1 : 0;
      else if (type === 6) value = values[0] < values[1] ? 1 : 0;
      else if (type === 7) value = values[0] === values[1] ? 1 : 0;


      return [value, pointer];
    }
  }

  const [value] = runInstructions(instructions[0]);
  console.log('Answer 1', versionSum);
  console.log('Answer 2', value);
}
