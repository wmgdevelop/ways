"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logJson = exports.logWarning = exports.logError = exports.logSubtitle = exports.logTitle = exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
function log(message) {
    console.log(message);
}
exports.log = log;
function logTitle(title) {
    log(chalk_1.default.bold(chalk_1.default.magenta(title)));
}
exports.logTitle = logTitle;
function logSubtitle(subtitle) {
    log(chalk_1.default.blue(subtitle));
}
exports.logSubtitle = logSubtitle;
function logError(error) {
    log(chalk_1.default.red(error));
}
exports.logError = logError;
function logWarning(warning) {
    log(chalk_1.default.yellow(warning));
}
exports.logWarning = logWarning;
function logJson(title, json) {
    console.log(chalk_1.default.blue(`${title}:`), json);
}
exports.logJson = logJson;
