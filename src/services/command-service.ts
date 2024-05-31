import { exec } from 'child_process';
import os from 'os';
import { logError } from './log-service';

const isWindows = os.platform() === 'win32';
const isUnixLike = os.platform() === 'linux' || os.platform() === 'darwin';

type RunCommandOptions = {
  cwd?: string;
  silent?: boolean;
}

export async function runCommand(command: string, options: RunCommandOptions = {}): Promise<string> {
  handleCommand();
  return new Promise((resolve, reject) => {
    exec(command, options, onRunCommand);

    function onRunCommand(error: any, stdout: string, stderr: string) {
      if (error) {
        logError(error);
        return reject(error);
      }
      if (stderr) {
        logError(stderr);
        return reject(stderr);
      }
      resolve(stdout);
    }
  });

  function handleCommand() {
    if (options.silent) {
      if (isWindows) {
        command = `${command} >nul 2>&1`;
      } else if (isUnixLike) {
        command = `${command} >/dev/null 2>&1`;
      }
    }
  }
}
