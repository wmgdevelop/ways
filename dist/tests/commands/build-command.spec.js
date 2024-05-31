"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const rimraf_1 = require("rimraf");
const build_command_1 = require("../../src/commands/build-command");
const init_command_1 = require("../../src/commands/init-command");
const test_helper_1 = require("../test-helper");
describe('buildCommand', () => {
    const tempProjectPath = node_path_1.default.resolve(__dirname, 'temp-project');
    // const waysJsonPath = path.resolve(tempProjectPath, 'ways.json');
    let cwdSpy;
    let logSpy;
    beforeEach(async () => {
        jest.clearAllMocks();
        cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(tempProjectPath);
        logSpy = jest.spyOn(console, 'log').mockImplementation();
        await (0, rimraf_1.rimraf)(tempProjectPath);
    });
    afterEach(async () => {
        cwdSpy.mockRestore();
        await (0, rimraf_1.rimraf)(tempProjectPath);
    });
    it('should build with default ways.json configuration', async () => {
        await (0, init_command_1.initCommand)();
        await (0, test_helper_1.waitBuildTemplate)();
        await (0, build_command_1.buildCommand)();
        await (0, test_helper_1.waitBuildTemplate)();
        expect(logSpy.mock.calls.length).toBe(6);
        expect(logSpy.mock.calls[2][0]).toContain('Build project');
        expect(logSpy.mock.calls[3][0]).toContain('Read ways.json file');
        expect(logSpy.mock.calls[4][0]).toContain('Build template: hello');
        expect(logSpy.mock.calls[5][0]).toContain('Options:');
        expect(logSpy.mock.calls[5][1]).toEqual({ name: 'world' });
    });
});
