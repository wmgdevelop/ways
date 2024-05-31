"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = void 0;
const child_process_1 = require("child_process");
const os_1 = __importDefault(require("os"));
const log_service_1 = require("./log-service");
const isWindows = os_1.default.platform() === 'win32';
const isUnixLike = os_1.default.platform() === 'linux' || os_1.default.platform() === 'darwin';
async function runCommand(command, options = {}) {
    handleCommand();
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, options, onRunCommand);
        function onRunCommand(error, stdout, stderr) {
            if (error) {
                (0, log_service_1.logError)(error);
                return reject(error);
            }
            if (stderr) {
                (0, log_service_1.logError)(stderr);
                return reject(stderr);
            }
            resolve(stdout);
        }
    });
    function handleCommand() {
        if (options.silent) {
            if (isWindows) {
                command = `${command} >nul 2>&1`;
            }
            else if (isUnixLike) {
                command = `${command} >/dev/null 2>&1`;
            }
        }
    }
}
exports.runCommand = runCommand;
