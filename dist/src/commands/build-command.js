"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommand = void 0;
const file_service_1 = require("../services/file-service");
const log_service_1 = require("../services/log-service");
async function buildCommand() {
    (0, log_service_1.logTitle)('Build project');
    (0, log_service_1.logSubtitle)('Read ways.json file');
    let waysJson;
    try {
        waysJson = await (0, file_service_1.getWaysJson)();
    }
    catch (error) {
        return handleWaysJsonReadError(error);
    }
    for (const way of waysJson) {
        buildWay(way);
    }
}
exports.buildCommand = buildCommand;
function handleWaysJsonReadError(error) {
    if (error instanceof file_service_1.WaysJsonNotFountError) {
        (0, log_service_1.logError)('Project is not initialized. Run `ways init` command to initialize it.');
    }
    else {
        (0, log_service_1.logError)('An unexpected error occurred while reading ways.json file.');
    }
}
function buildWay(way) {
    for (const template of way.templates) {
        buildWayTemplate(template, way);
    }
}
function buildWayTemplate(template, way) {
    (0, log_service_1.logSubtitle)(`Build template: ${template}`);
    for (const options of way.options) {
        buildWayOptions(template, options);
    }
}
function buildWayOptions(template, options) {
    (0, log_service_1.logJson)('Options', options);
    (0, file_service_1.buildTemplate)({
        template,
        destiny: (0, file_service_1.getCurrentDir)(),
        options,
    });
}
