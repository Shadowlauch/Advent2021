import {readFileLines} from '../utils';

class Node {
  constructor(public parent: Node | null, public value: number | undefined, public children: Node[] = []) {}

  public isLeaf(): boolean {
    return this.children.length === 0;
  }

  public depth(): number {
    return (this.parent?.depth?.() ?? 0) + 1;
  }
}

export default async function (fileName: string) {
  const lines = await readFileLines<string>(__dirname + '/' + fileName);

  const stringToTree = (str: string): Node => {
    const stack: Node[] = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '[' || str[i].match(/[0-9]{1}/) !== null) {
        const parent = stack[stack.length - 1];
        const isLeaf = str[i] !== '[';

        const child = new Node(parent, isLeaf ? parseInt(str[i]) : undefined, []);

        if (parent) parent.children.push(child);
        if (!isLeaf) stack.push(child);
      } else if (str[i] === ']') {
        const node = stack.pop();
        if (stack.length === 0) return node;
      }
    }
  };

  const printTree = (node: Node): string => {
    if (node.isLeaf()) return node.value.toString();
    else return '[' + node.children.map(n => printTree(n)).join(',') + ']';
  };

  const findExplosions = (node: Node): Node | false => {
    if (node.depth() > 4 && !node.isLeaf() && node.children.every(c => c.isLeaf())) return node;

    for (const child of node.children) {
      const rValue = findExplosions(child);

      if (rValue) return rValue;
    }

    return false;
  };

  const findSplits = (node: Node): Node | false => {
    for (const child of node.children) {
      if (child.value >= 10 && child.isLeaf()) return child;
      const rValue = findSplits(child);

      if (rValue) return rValue;
    }

    return false;
  };

  const getLeafs = (node: Node): Node[] => {
    if (node.isLeaf()) return [node];
    else return node.children.map(c => getLeafs(c)).reduce((c, v) => [...c, ...v], []);
  };

  const reduce = (root: Node) => {
    while (true) {
      const explosionNode = findExplosions(root);
      const splitNode = explosionNode ? null : findSplits(root);
      if (splitNode) {
        splitNode.children = [Math.floor(splitNode.value / 2), Math.ceil(splitNode.value / 2)].map(v => new Node(splitNode as Node, v, []));
        splitNode.value = undefined;
      } else if (explosionNode) {
        const [leftValue, rightValue] = explosionNode.children.map(n => n.value);
        //update leafs array

        explosionNode.value = 0;
        explosionNode.children = [];

        const leafs = getLeafs(root);
        const leafsIndex = leafs.findIndex(n => n === explosionNode);
        if (leafsIndex > 0) leafs[leafsIndex - 1].value += leftValue;
        if (leafsIndex < leafs.length - 1) leafs[leafsIndex + 1].value += rightValue;
      } else {
        break;
      }
    }
  };

  const calculateMagnitude = (node: Node): number => {
    if (node.isLeaf()) return node.value;
    else return calculateMagnitude(node.children[0]) * 3 + calculateMagnitude(node.children[1]) * 2;
  }

  let currentRoot = stringToTree(lines[0]);
  for (let i = 1; i < lines.length; i++) {
    const rightRoot = stringToTree(lines[i]);
    const newRoot = new Node(null, undefined, [currentRoot, rightRoot]);
    currentRoot.parent = newRoot;
    rightRoot.parent = newRoot;

    reduce(newRoot);
    currentRoot = newRoot;
  }

  console.log('Answer 1', calculateMagnitude(currentRoot));

  let maxMagnitude = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (i === j) continue;

      const rightRoot = stringToTree(lines[i]);
      const leftRoot = stringToTree(lines[j]);
      const newRoot = new Node(null, undefined, [leftRoot, rightRoot]);
      leftRoot.parent = newRoot;
      rightRoot.parent = newRoot;

      reduce(newRoot);
      maxMagnitude = Math.max(maxMagnitude, calculateMagnitude(newRoot));
    }
  }
  console.log('Answer 2', maxMagnitude);
}
