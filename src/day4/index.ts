import {readFile} from 'fs/promises';

type Board = number[];

function indexToCoords (i: number) {
  return [i % 5, Math.floor(i / 5)];
}

const checkBoard = (board: Board, draw: number[]) => {
  let rows = [true, true, true, true, true];
  let cols = [true, true, true, true, true];
  let unmarkedSum = 0;
  
  for (let i = 0; i < board.length; i++) {
    const val = board[i];
    const [x, y] = indexToCoords(i);
    const drawn = draw.includes(val);

    unmarkedSum += drawn ? 0 : val;

    rows[y] = drawn && rows[y];
    cols[x] = drawn && cols[x];
  }

  return rows.includes(true) || cols.includes(true) ? unmarkedSum : 0;
}

const checkBoards = (boards: Board[], draw: number[]) => {
  for (const board of boards) {
    const sum = checkBoard(board, draw);

    if (sum > 0) return sum * draw[draw.length - 1];
  }

  return 0;
}

(async () => {
  const lines = await readFile(__dirname + '/input.txt').then(b => b.toString().split('\r\n'));

  const draw = lines[0].split(',').map(i => parseInt(i));

  const boards = [];
  let board: Board;
  for (const line of lines.slice(1)) {
    if (line.length < 2) {
      board = [];
      boards.push(board);
      continue;
    }

    board.push(...line.trim().split(' ').map(i => parseInt(i)).filter(i => Number.isInteger(i)));
  }
  boards.splice(-1, 1)

  for (let i = 0; i < draw.length; i++) {
    const currentDraw = draw.slice(0, i);
    const boardSum = checkBoards(boards, currentDraw);

    if (boardSum > 0) {
      console.log('Answer 1', boardSum);
      break;
    }
  }

  outer: for (let i = 0; i < draw.length; i++) {
    const currentDraw = draw.slice(0, i);

    for (let j = 0; j < boards.length; j++) {
      const boardSum = checkBoard(boards[j], currentDraw);

      if (boardSum > 0) {
        if (boards.length === 1) {
          console.log('Answer 2', boardSum * currentDraw[currentDraw.length - 1]);
          break outer;
        } else {
          boards.splice(j, 1);
        }
      }
    }
  }

})();
