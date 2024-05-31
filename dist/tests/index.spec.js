"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_command_1 = require("../src/commands/build-command");
const init_command_1 = require("../src/commands/init-command");
const index_1 = require("../src/index");
jest.mock('../src/commands/init-command');
jest.mock('../src/commands/build-command');
describe('index', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should register init command', () => {
        expect(index_1.program.commands.find(command => command.name() === 'init')).toBeDefined();
    });
    it('should register build command', () => {
        expect(index_1.program.commands.find(command => command.name() === 'build')).toBeDefined();
    });
    it('should call initCommand action when init command is executed', () => {
        const mockInitCommand = init_command_1.initCommand;
        index_1.program.parse(['node', 'dist/index.js', 'init']);
        expect(mockInitCommand).toHaveBeenCalled();
    });
    it('should call buildCommand action when build command is executed', () => {
        const mockBuildCommand = build_command_1.buildCommand;
        index_1.program.parse(['node', 'dist/index.js', 'build']);
        expect(mockBuildCommand).toHaveBeenCalled();
    });
});
