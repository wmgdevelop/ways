"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const rimraf_1 = require("rimraf");
const init_command_1 = require("../../src/commands/init-command");
const test_helper_1 = require("../test-helper");
describe('initCommand', () => {
    const tempProjectPath = node_path_1.default.resolve(__dirname, 'temp-project-init');
    const waysJsonPath = node_path_1.default.resolve(tempProjectPath, 'ways.json');
    let cwdSpy;
    let logSpy;
    beforeEach(async () => {
        cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(tempProjectPath);
        logSpy = jest.spyOn(console, 'log').mockImplementation();
        await (0, rimraf_1.rimraf)(tempProjectPath);
    });
    afterEach(async () => {
        jest.restoreAllMocks();
        await (0, rimraf_1.rimraf)(tempProjectPath);
    });
    it('should initialize project creating way.json', async () => {
        await (0, init_command_1.initCommand)();
        expect(logSpy.mock.calls.length).toBe(2);
        expect(logSpy.mock.calls[0][0]).toContain('Initialize project');
        expect(logSpy.mock.calls[1][0]).toContain('Generating ways.json file');
        await (0, test_helper_1.waitBuildTemplate)();
        const isExistingWaysJson = (0, node_fs_1.existsSync)(waysJsonPath);
        expect(isExistingWaysJson).toBeTruthy();
        const waysJson = require(waysJsonPath);
        expect(waysJson).toEqual([{
                templates: ['hello'],
                options: [{ name: 'world' }]
            }]);
    });
    it('should override the existing ways.json file and display a warning message', async () => {
        await (0, init_command_1.initCommand)();
        await (0, test_helper_1.waitBuildTemplate)();
        await (0, init_command_1.initCommand)();
        await (0, test_helper_1.waitBuildTemplate)();
        expect(logSpy.mock.calls.length).toBe(5);
        expect(logSpy.mock.calls[4][0]).toContain('ways.json was overwritten!');
    });
});
