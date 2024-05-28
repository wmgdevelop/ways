import chalk from 'chalk';

export function log(message: string) {
  console.log(message);
}

export function logTitle(title: string) {
  log(chalk.bold(chalk.magenta(title)));
}

export function logSubtitle(subtitle: string) {
  log(chalk.blue(subtitle));
}

export function logError(error: unknown) {
  log(chalk.red(error));
}

export function logWarning(warning: string) {
  log(chalk.yellow(warning));
}

export function logJson(title: string, json: unknown) {
  console.log(chalk.blue(`${title}:`), json);
}
