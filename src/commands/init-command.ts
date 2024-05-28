import { snakeCase, startCase } from 'lodash';
import { buildTemplate, getCurrentDir, getCurrentDirBasename, getHomeDirBaseName } from '../services/file-service';
import { logSubtitle, logTitle } from '../services/log-service';

export async function initCommand() {
  logTitle('Initialize project');
  logSubtitle('Generating ways.json file');
  const name = getCurrentDirBasename();
  const user = startCase(getHomeDirBaseName());
  const email = `${snakeCase(user)}@example.com`;
  await buildTemplate({
    template: 'ways',
    destiny: getCurrentDir(),
    options: { name, user, email },
  });
}
