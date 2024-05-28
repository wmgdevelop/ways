"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaysService = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
class WaysService {
    static async buildTemplate({ template, destiny, options }) {
        const templatePath = node_path_1.default.resolve(__dirname, `../../templates/${template}`);
        const templateConfigPath = node_path_1.default.resolve(templatePath, 'config.json');
        const templateConfig = JSON.parse(await promises_1.default.readFile(templateConfigPath, 'utf8'));
        console.log(templateConfig);
    }
}
exports.WaysService = WaysService;
