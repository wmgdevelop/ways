import { exec } from 'child_process';
import os from 'os';
import { logError } from './log-service';

const isWindows = os.platform() === 'win32';
const isLunix = os.platform() === 'linux';

type RunCommandOptions = {
  cwd?: string;
  silent?: boolean;
}

export async function runCommand(command: string, options: RunCommandOptions): Promise<string> {
  handleCommand();
  return new Promise((resolve, _) => {
    exec(command, options, onRunCommand);

    function onRunCommand(error: any, stdout: string | PromiseLike<string>, stderr: any) {
      if (error) {
        return logError(error);
      }
      if (stderr) {
        return logError(stderr);
      }
      resolve(stdout);
    };
  });

  function handleCommand() {
    if (options.silent) {
      if (isWindows) {
        command = `${command} >nul 2>&1`;
      }
      if (isLunix) {
        command = `${command} >/dev/null 2>&1`;
      }
    }
  }
}
