import path from 'node:path';
import { rimraf } from 'rimraf';
import { buildCommand } from '../../src/commands/build-command';
import { initCommand } from '../../src/commands/init-command';
import { waitBuildTemplate } from '../test-helper';

describe('buildCommand', () => {
  const tempProjectPath = path.resolve(__dirname, 'temp-project');
  // const waysJsonPath = path.resolve(tempProjectPath, 'ways.json');
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

  it('should build with default ways.json configuration', async () => {
    await initCommand();
    await waitBuildTemplate();
    await buildCommand();
    await waitBuildTemplate();
    expect(logSpy.mock.calls.length).toBe(6);
    expect(logSpy.mock.calls[2][0]).toContain('Build project');
    expect(logSpy.mock.calls[3][0]).toContain('Read ways.json file');
    expect(logSpy.mock.calls[4][0]).toContain('Build template: hello');
    expect(logSpy.mock.calls[5][0]).toContain('Options:');
    expect(logSpy.mock.calls[5][1]).toEqual({ name: 'world' });
  });
});
