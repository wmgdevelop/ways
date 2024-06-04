import { camelCase, kebabCase, lowerFirst, snakeCase, upperFirst } from 'lodash';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { WaysJsonEntity } from '../entities/ways-json-entity';
import { logWarning } from './log-service';

export type Options = { [key: string]: string };

export type UseTemplateProps = {
  template: string;
  destiny: string;
  options: Options;
}

export async function getJson(filePath: string) {
  const isExistingFilePath = existsSync(filePath);
  if (!isExistingFilePath) {
    return null;
  }
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

export async function getGeneralWaysConfig() {
  const generalWaysConfigPath = getPath(os.homedir(), '.ways.json');
  return getJson(generalWaysConfigPath);
}

export function getNewOptions(options: Options): Options {
  return Object.entries(options).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [`${lowerFirst(key)}`]: lowerFirst(value),
      [`${upperFirst(key)}`]: upperFirst(value),
      [`${key}KebabCase`]: kebabCase(value),
      [`${key}SnakeCase`]: snakeCase(value),
      [`${lowerFirst(key)}CamelCase`]: lowerFirst(camelCase(value)),
      [`${upperFirst(key)}CamelCase`]: upperFirst(camelCase(value)),
    };
  }, {});
}

export async function buildTemplate({ template, destiny, options }: UseTemplateProps): Promise<void> {
  const newOptions = getNewOptions(options);
  const generalWaysConfig = await getGeneralWaysConfig();
  const templatePath = getTemplatePath();
  const fileNames = await fs.readdir(templatePath);

  createDirectory(destiny);

  for (const fileName of fileNames) {
    const newFileName = fileName.replace(/\[(.*?)\]/, (_, key) => newOptions[key]);
    const filePath = getPath(templatePath, fileName);
    const destinyPath = getPath(destiny, newFileName);
    const fileStat = await fs.stat(filePath);
    const isADir = fileStat.isDirectory();
    const isAFile = fileStat.isFile();
    if (isAFile) {
      handleFile(filePath, destinyPath);
    }
    if (isADir) {
      handleDir(destinyPath, fileName);
    }
  }

  function getDirName() {
    const githubWorkspace = process.env.GITHUB_WORKSPACE;
    if (githubWorkspace) {
      return path.resolve(githubWorkspace, 'src/services');
    }
    return __dirname;
  }

  function getTemplatePath() {
    const dirName = getDirName();
    const generalTemplatesPath = generalWaysConfig?.templatesPath;
    const generalTemplatePath = generalTemplatesPath ? getPath(generalTemplatesPath, template) : null;
    const isGeneralTemplatePathExisting = !!generalTemplatePath && existsSync(generalTemplatePath);
    if (isGeneralTemplatePathExisting) {
      return generalTemplatePath;
    }
    return getPath(dirName, `../../templates/${template}`);
  }

  async function handleFile(filePath: string, destinyPath: string) {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const isExistingFilePath = existsSync(destinyPath);
    if (isExistingFilePath) {
      logWarning(`File ${destinyPath} was overwritten!`)
    }
    const newFileContent = fileContent.replace(/__(.*?)__/g, (_, key) => newOptions[key]);
    await createFile(destinyPath, newFileContent);
  }

  async function handleDir(destinyPath: string, fileName: string) {
    const isDestinyPathExisting = existsSync(destinyPath);
    if (!isDestinyPathExisting) {
      await createDirectory(destinyPath);
    }
    await buildTemplate({ template: `${template}/${fileName}`, destiny: destinyPath, options: newOptions });
  }
}

export function getCurrentDir(): string {
  return process.cwd();
}

export function getCurrentDirBasename(): string {
  const currrentDir = getCurrentDir();
  return path.basename(currrentDir);
}

export function getHomeDirBaseName(): string {
  return path.basename(os.homedir());
}

export class WaysJsonNotFountError extends Error { }

export async function getWaysJson(): Promise<WaysJsonEntity> {
  const currrentDir = getCurrentDir();
  const waysJsonPath = getPath(currrentDir, 'ways.json');
  const isExistingWaysJson = existsSync(waysJsonPath);
  if (!isExistingWaysJson) {
    throw new WaysJsonNotFountError();
  }
  const waysJsonContent = await fs.readFile(waysJsonPath, 'utf-8');
  return JSON.parse(waysJsonContent);
}

export async function createDirectory(dirPath: string) {
  const isExistingDir = existsSync(dirPath);
  if (!isExistingDir) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

export async function createFile(filePath: string, content: string) {
  await fs.writeFile(filePath, content);
}

export function getPath(...paths: string[]): string {
  return path.resolve(...paths);
}
