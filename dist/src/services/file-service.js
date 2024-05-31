"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = exports.createFile = exports.createDirectory = exports.getWaysJson = exports.WaysJsonNotFountError = exports.getHomeDirBaseName = exports.getCurrentDirBasename = exports.getCurrentDir = exports.buildTemplate = exports.getNewOptions = exports.getGeneralWaysConfig = exports.getJson = void 0;
const lodash_1 = require("lodash");
const node_fs_1 = require("node:fs");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const log_service_1 = require("./log-service");
async function getJson(filePath) {
    const isExistingFilePath = (0, node_fs_1.existsSync)(filePath);
    if (!isExistingFilePath) {
        return null;
    }
    const fileContent = await promises_1.default.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
}
exports.getJson = getJson;
async function getGeneralWaysConfig() {
    const generalWaysConfigPath = getPath(node_os_1.default.homedir(), '.ways.json');
    return getJson(generalWaysConfigPath);
}
exports.getGeneralWaysConfig = getGeneralWaysConfig;
function getNewOptions(options) {
    return Object.entries(options).reduce((acc, [key, value]) => {
        return {
            ...acc,
            [`${(0, lodash_1.lowerFirst)(key)}`]: (0, lodash_1.lowerFirst)(value),
            [`${(0, lodash_1.upperFirst)(key)}`]: (0, lodash_1.upperFirst)(value),
            [`${key}KebabCase`]: (0, lodash_1.kebabCase)(value),
            [`${key}SnakeCase`]: (0, lodash_1.snakeCase)(value),
            [`${(0, lodash_1.lowerFirst)(key)}CamelCase`]: (0, lodash_1.lowerFirst)((0, lodash_1.camelCase)(value)),
            [`${(0, lodash_1.upperFirst)(key)}CamelCase`]: (0, lodash_1.upperFirst)((0, lodash_1.camelCase)(value)),
        };
    }, {});
}
exports.getNewOptions = getNewOptions;
async function buildTemplate({ template, destiny, options }) {
    const newOptions = getNewOptions(options);
    const generalWaysConfig = await getGeneralWaysConfig();
    const templatePath = getTemplatePath();
    const fileNames = await promises_1.default.readdir(templatePath);
    createDirectory(destiny);
    for (const fileName of fileNames) {
        const newFileName = fileName.replace(/\[(.*?)\]/, (_, key) => newOptions[key]);
        const filePath = getPath(templatePath, fileName);
        const destinyPath = getPath(destiny, newFileName);
        const fileStat = await promises_1.default.stat(filePath);
        const isADir = fileStat.isDirectory();
        const isAFile = fileStat.isFile();
        if (isAFile) {
            handleFile(filePath, destinyPath);
        }
        if (isADir) {
            handleDir(destinyPath, fileName);
        }
    }
    function getTemplatePath() {
        const generalTemplatesPath = generalWaysConfig?.templatesPath;
        const generalTemplatePath = generalTemplatesPath ? getPath(generalTemplatesPath, template) : null;
        const isGeneralTemplatePathExisting = !!generalTemplatePath && (0, node_fs_1.existsSync)(generalTemplatePath);
        if (isGeneralTemplatePathExisting) {
            return generalTemplatePath;
        }
        return getPath(__dirname, `../../templates/${template}`);
    }
    async function handleFile(filePath, destinyPath) {
        const fileContent = await promises_1.default.readFile(filePath, 'utf-8');
        const isExistingFilePath = (0, node_fs_1.existsSync)(destinyPath);
        if (isExistingFilePath) {
            (0, log_service_1.logWarning)(`File ${destinyPath} was overwritten!`);
        }
        const newFileContent = fileContent.replace(/__(.*?)__/g, (_, key) => newOptions[key]);
        await createFile(destinyPath, newFileContent);
    }
    async function handleDir(destinyPath, fileName) {
        const isDestinyPathExisting = (0, node_fs_1.existsSync)(destinyPath);
        if (!isDestinyPathExisting) {
            await createDirectory(destinyPath);
        }
        await buildTemplate({ template: `${template}/${fileName}`, destiny: destinyPath, options: newOptions });
    }
}
exports.buildTemplate = buildTemplate;
function getCurrentDir() {
    return process.cwd();
}
exports.getCurrentDir = getCurrentDir;
function getCurrentDirBasename() {
    const currrentDir = getCurrentDir();
    return node_path_1.default.basename(currrentDir);
}
exports.getCurrentDirBasename = getCurrentDirBasename;
function getHomeDirBaseName() {
    return node_path_1.default.basename(node_os_1.default.homedir());
}
exports.getHomeDirBaseName = getHomeDirBaseName;
class WaysJsonNotFountError extends Error {
}
exports.WaysJsonNotFountError = WaysJsonNotFountError;
async function getWaysJson() {
    const currrentDir = getCurrentDir();
    const waysJsonPath = getPath(currrentDir, 'ways.json');
    const isExistingWaysJson = (0, node_fs_1.existsSync)(waysJsonPath);
    if (!isExistingWaysJson) {
        throw new WaysJsonNotFountError();
    }
    const waysJsonContent = await promises_1.default.readFile(waysJsonPath, 'utf-8');
    return JSON.parse(waysJsonContent);
}
exports.getWaysJson = getWaysJson;
async function createDirectory(dirPath) {
    const isExistingDir = (0, node_fs_1.existsSync)(dirPath);
    if (!isExistingDir) {
        await promises_1.default.mkdir(dirPath, { recursive: true });
    }
}
exports.createDirectory = createDirectory;
async function createFile(filePath, content) {
    await promises_1.default.writeFile(filePath, content);
}
exports.createFile = createFile;
function getPath(...paths) {
    return node_path_1.default.resolve(...paths);
}
exports.getPath = getPath;
