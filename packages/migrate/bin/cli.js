#!/usr/bin/env node
import { argv, exit } from 'node:process';
import { main } from '../dist/cli.js';

main(argv.slice(2)).then(
  (code) => exit(code),
  (err) => {
    process.stderr.write(`${err instanceof Error ? (err.stack ?? err.message) : String(err)}\n`);
    exit(1);
  },
);
