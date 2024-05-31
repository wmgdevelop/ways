import { buildCommand } from '../src/commands/build-command';
import { initCommand } from '../src/commands/init-command';
import { program } from '../src/index';

jest.mock('../src/commands/init-command');
jest.mock('../src/commands/build-command');

describe('index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register init command', () => {
    expect(program.commands.find(command => command.name() === 'init')).toBeDefined();
  });

  it('should register build command', () => {
    expect(program.commands.find(command => command.name() === 'build')).toBeDefined();
  });

  it('should call initCommand action when init command is executed', () => {
    const mockInitCommand = initCommand as jest.MockedFunction<typeof initCommand>;
    program.parse(['node', 'dist/index.js', 'init']);
    expect(mockInitCommand).toHaveBeenCalled();
  })

  it('should call buildCommand action when build command is executed', () => {
    const mockBuildCommand = buildCommand as jest.MockedFunction<typeof buildCommand>;
    program.parse(['node', 'dist/index.js', 'build']);
    expect(mockBuildCommand).toHaveBeenCalled();
  })
})
