#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const package_json_1 = __importDefault(require("../package.json"));
const build_command_1 = require("./commands/build-command");
const init_command_1 = require("./commands/init-command");
const program = new commander_1.Command();
program
    .name(package_json_1.default.name)
    .description(package_json_1.default.description)
    .version(package_json_1.default.version);
program
    .command('init')
    .description('Initialize a new project')
    .action(init_command_1.initCommand);
program
    .command('build')
    .description('Build project')
    .action(build_command_1.buildCommand);
program.parse(process.argv);
