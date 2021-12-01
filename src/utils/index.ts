import {readFile} from 'fs/promises';

export const readFileLines = <T extends any>(fileName: string, parse = (a: any) => a): Promise<T[]> => readFile(fileName).then(b => b.toString().split('\r\n').filter(l => l).map(parse));

export const readFileGrid = (fileName: string): Promise<string[][]> => readFile(fileName).then(b => b.toString().split('\r\n').filter(x => x).map(r => r.trim().split('')));

export const mod = (n: number, m: number): number => ((n % m) + m) % m;
