import {readFileLines} from '../utils';

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);

  const positions = [parseInt(lines[0].slice(-1)), parseInt(lines[1].slice(-1))];
  const answer1 = async (positions: number[]) => {

    const scores = [0, 0];
    let diceRolls = 1;
    let player = 0;

    while (Math.max(...scores) < 1000) {
      const diceSum = diceRolls + (diceRolls + 1) + (diceRolls + 2);
      positions[player] = ((positions[player] - 1 + diceSum) % 10) + 1;
      scores[player] += positions[player];

      diceRolls += 3;
      player = (player + 1) % 2;
    }

    console.log('Answer 1', Math.min(...scores) * (diceRolls - 1))
  };


  await answer1([...positions]);

  const answer2 = async (positions: number[]) => {
    const possibleRolls = [
      [3, 1],
      [4, 3],
      [5, 6],
      [6, 7],
      [7, 6],
      [8, 3],
      [9, 1]
    ]

    const memo = new Map<string, [number, number]>();
    const turn = (player: [number, number], otherPlayer: [number, number]): [number, number] => {
      const key = `${player.join('|')}|${otherPlayer.join('|')}`;
      if (memo.has(key)) return memo.get(key);
      else {
        const result = possibleRolls.reduce((c, [roll, count]) => {
          const newPosition = ((player[0] - 1 + roll) % 10) + 1;
          const newScore = player[1] + newPosition;

          if (newScore >= 21) return [c[0] + count, c[1]];
          else {
            const [opWins, pWins] = turn(otherPlayer, [newPosition, newScore]);
            return [c[0] + (pWins * count), c[1] + (opWins * count)];
          }
        }, [0, 0]) as [number, number];

        memo.set(key, result);
        return result;
      }
    }

    console.log('Answer 2', Math.max(...turn([positions[0], 0], [positions[1], 0])))
  };

  await answer2([...positions]);
}
