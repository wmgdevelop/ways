"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = void 0;
const lodash_1 = require("lodash");
const file_service_1 = require("../services/file-service");
const log_service_1 = require("../services/log-service");
async function initCommand() {
    (0, log_service_1.logTitle)('Initialize project');
    (0, log_service_1.logSubtitle)('Generating ways.json file');
    const name = (0, file_service_1.getCurrentDirBasename)();
    const user = (0, lodash_1.startCase)((0, file_service_1.getHomeDirBaseName)());
    const email = `${(0, lodash_1.snakeCase)(user)}@example.com`;
    await (0, file_service_1.buildTemplate)({
        template: 'ways',
        destiny: (0, file_service_1.getCurrentDir)(),
        options: { name, user, email },
    });
}
exports.initCommand = initCommand;
