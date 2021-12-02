import {readFileLines} from '../utils';


(async () => {
  const commands = await readFileLines<[string, string]>(__dirname + '/input.txt', (i) => i.split(" "));

  let forward = 0;
  let depth = 0;
  for (const command of commands) {
    const [dir, delta] = [command[0], parseInt(command[1])];

    if (dir === "forward") forward += delta;
    else if (dir === "down") depth += delta;
    else if (dir === "up") depth -= delta;
  }

  console.log('Answer 1', depth * forward);

  forward = 0;
  depth = 0;
  let aim = 0;
  for (const command of commands) {
    const [dir, delta] = [command[0], parseInt(command[1])];

    if (dir === "forward") {
      forward += delta;
      depth += aim * delta;
    } else if (dir === "down") aim += delta;
    else if (dir === "up") aim -= delta;
  }

  console.log('Answer 2', depth * forward);
})();
