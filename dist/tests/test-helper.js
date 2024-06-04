"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitBuildTemplate = exports.wait = void 0;
async function wait(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}
exports.wait = wait;
async function waitBuildTemplate() {
    await wait(100);
}
exports.waitBuildTemplate = waitBuildTemplate;
