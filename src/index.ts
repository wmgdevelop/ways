#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../package.json';
import { buildCommand } from './commands/build-command';
import { initCommand } from './commands/init-command';

const program = new Command();

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version);

program
  .command('init')
  .description('Initialize a new project')
  .action(initCommand);

program
  .command('build')
  .description('Build project')
  .action(buildCommand);

program.parse(process.argv);
