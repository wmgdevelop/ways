import { existsSync } from 'node:fs';
import path from 'node:path';
import { rimraf } from 'rimraf';
import { initCommand } from '../../src/commands/init-command';
import { waitBuildTemplate } from '../test-helper';

describe('initCommand', () => {
  const tempProjectPath = path.resolve(__dirname, 'temp-project');
  const waysJsonPath = path.resolve(tempProjectPath, 'ways.json');
  let cwdSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(async () => {
    jest.clearAllMocks();
    cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(tempProjectPath);
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    await rimraf(tempProjectPath);
  });

  afterEach(async () => {
    cwdSpy.mockRestore();
    await rimraf(tempProjectPath);
  });

  it('should initialize project creating way.json', async () => {
    await initCommand();
    expect(logSpy.mock.calls.length).toBe(2);
    expect(logSpy.mock.calls[0][0]).toContain('Initialize project');
    expect(logSpy.mock.calls[1][0]).toContain('Generating ways.json file');
    await waitBuildTemplate();
    const isExistingWaysJson = existsSync(waysJsonPath);
    expect(isExistingWaysJson).toBeTruthy();
    const waysJson = require(waysJsonPath);
    expect(waysJson).toEqual([{
      templates: ['hello'],
      options: [{ name: 'world' }]
    }]);
  });

  it('should override the existing ways.json file and display a warning message', async () => {
    await initCommand();
    await waitBuildTemplate();
    await initCommand();
    await waitBuildTemplate();
    expect(logSpy.mock.calls.length).toBe(5);
    expect(logSpy.mock.calls[4][0]).toContain('ways.json was overwritten!');
  });
});