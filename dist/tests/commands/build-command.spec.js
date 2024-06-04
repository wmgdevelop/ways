"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const node_process_1 = __importDefault(require("node:process"));
const rimraf_1 = require("rimraf");
const build_command_1 = require("../../src/commands/build-command");
const init_command_1 = require("../../src/commands/init-command");
const test_helper_1 = require("../test-helper");
describe('buildCommand', () => {
    const tempProjectPath = node_path_1.default.resolve(__dirname, 'temp-project-build');
    const waysJsonPath = node_path_1.default.resolve(tempProjectPath, 'ways.json');
    let cwdSpy;
    let logSpy;
    beforeEach(async () => {
        cwdSpy = jest.spyOn(node_process_1.default, 'cwd').mockReturnValue(tempProjectPath);
        logSpy = jest.spyOn(console, 'log').mockImplementation();
        await (0, rimraf_1.rimraf)(tempProjectPath);
    });
    afterEach(async () => {
        jest.restoreAllMocks();
        await (0, rimraf_1.rimraf)(tempProjectPath);
    });
    it('should build with default ways.json configuration', async () => {
        await (0, init_command_1.initCommand)();
        await (0, test_helper_1.waitBuildTemplate)();
        await (0, build_command_1.buildCommand)();
        await (0, test_helper_1.waitBuildTemplate)();
        expect(logSpy.mock.calls.length).toBe(6);
        expect(logSpy.mock.calls[2][0]).toContain('Build project');
        expect(logSpy.mock.calls[3][0]).toContain('Read ways.json file');
        expect(logSpy.mock.calls[4][0]).toContain('Build template: hello');
        expect(logSpy.mock.calls[5][0]).toContain('Options:');
        expect(logSpy.mock.calls[5][1]).toEqual({ name: 'world' });
    });
    describe('custom templates', () => {
        const globalWaysJsonPath = node_path_1.default.resolve(node_os_1.default.homedir(), '.ways.json');
        const originalReadFile = promises_1.default.readFile;
        let globalWaysJsonStub;
        beforeEach(async () => {
            globalWaysJsonStub = _getGlobalWaysJsonStub();
            await (0, rimraf_1.rimraf)(tempProjectPath);
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        it('should build with simple custom template', async () => {
            await _createCustomWaysJson([{
                    templates: ['simple-custom-template'],
                    options: [{ myVariable: 'myValue' }]
                }]);
            await (0, test_helper_1.waitBuildTemplate)();
            await (0, build_command_1.buildCommand)();
            await (0, test_helper_1.waitBuildTemplate)();
            const indexTsPath = node_path_1.default.resolve(tempProjectPath, 'index.ts');
            const isExistingIndexFile = (0, node_fs_1.existsSync)(indexTsPath);
            expect(isExistingIndexFile).toBeTruthy();
            const indexFileContent = await promises_1.default.readFile(indexTsPath, 'utf-8');
            expect(indexFileContent).toContain('My simple custom template: myValue');
        });
        it('should build two templates with same options', async () => {
            await _createCustomWaysJson([{
                    templates: ['entity-ts', 'repository-ts'],
                    options: [{ name: 'myModule' }]
                }]);
            await (0, test_helper_1.waitBuildTemplate)();
            await (0, build_command_1.buildCommand)();
            await (0, test_helper_1.waitBuildTemplate)();
            const myModuleEntityPath = node_path_1.default.resolve(tempProjectPath, 'src/entities/my-module-entity.ts');
            const isExistingEntityFile = (0, node_fs_1.existsSync)(myModuleEntityPath);
            expect(isExistingEntityFile).toBeTruthy();
            const myModuleEntityContent = await promises_1.default.readFile(myModuleEntityPath, 'utf-8');
            expect(myModuleEntityContent).toContain('export class MyModuleEntity {');
            const myModuleRepositoryPath = node_path_1.default.resolve(tempProjectPath, 'src/repositories/my-module-repository.ts');
            const isExistingRepositoryFile = (0, node_fs_1.existsSync)(myModuleRepositoryPath);
            expect(isExistingRepositoryFile).toBeTruthy();
            const myModuleRepositoryContent = await promises_1.default.readFile(myModuleRepositoryPath, 'utf-8');
            expect(myModuleRepositoryContent).toContain('export interface MyModuleRepository {');
        });
        it('should build one template with different options', async () => {
            await _createCustomWaysJson([{
                    templates: ['entity-ts'],
                    options: [
                        { name: 'userProfile' },
                        { name: 'postComment' },
                        { name: 'purchaseOrder' },
                    ]
                }]);
            await (0, test_helper_1.waitBuildTemplate)();
            await (0, build_command_1.buildCommand)();
            await (0, test_helper_1.waitBuildTemplate)();
            const userProfileEntityPath = node_path_1.default.resolve(tempProjectPath, 'src/entities/user-profile-entity.ts');
            const isExistingUserProfileEntityFile = (0, node_fs_1.existsSync)(userProfileEntityPath);
            expect(isExistingUserProfileEntityFile).toBeTruthy();
            const userProfileEntityContent = await promises_1.default.readFile(userProfileEntityPath, 'utf-8');
            expect(userProfileEntityContent).toContain('export class UserProfileEntity {');
            const postCommentEntityPath = node_path_1.default.resolve(tempProjectPath, 'src/entities/post-comment-entity.ts');
            const isExistingPostCommentEntityFile = (0, node_fs_1.existsSync)(postCommentEntityPath);
            expect(isExistingPostCommentEntityFile).toBeTruthy();
            const postCommentEntityContent = await promises_1.default.readFile(postCommentEntityPath, 'utf-8');
            expect(postCommentEntityContent).toContain('export class PostCommentEntity {');
            const purchaseOrderEntityPath = node_path_1.default.resolve(tempProjectPath, 'src/entities/purchase-order-entity.ts');
            const isExistingPurchaseOrderEntityFile = (0, node_fs_1.existsSync)(purchaseOrderEntityPath);
            expect(isExistingPurchaseOrderEntityFile).toBeTruthy();
            const purchaseOrderEntityContent = await promises_1.default.readFile(purchaseOrderEntityPath, 'utf-8');
            expect(purchaseOrderEntityContent).toContain('export class PurchaseOrderEntity {');
        });
        it('should build two templates with different options', async () => {
            await _createCustomWaysJson([{
                    templates: ['entity-ts', 'repository-ts'],
                    options: [
                        { name: 'notificationSettings' },
                        { name: 'productCategory' },
                    ]
                }]);
            await (0, test_helper_1.waitBuildTemplate)();
            await (0, build_command_1.buildCommand)();
            await (0, test_helper_1.waitBuildTemplate)();
            const notificationSettingsEntityPath = node_path_1.default.resolve(tempProjectPath, 'src/entities/notification-settings-entity.ts');
            const isExistingNotificationSettingsEntityFile = (0, node_fs_1.existsSync)(notificationSettingsEntityPath);
            expect(isExistingNotificationSettingsEntityFile).toBeTruthy();
            const notificationSettingsEntityContent = await promises_1.default.readFile(notificationSettingsEntityPath, 'utf-8');
            expect(notificationSettingsEntityContent).toContain('export class NotificationSettingsEntity {');
            const productCategoryEntityPath = node_path_1.default.resolve(tempProjectPath, 'src/entities/product-category-entity.ts');
            const isExistingProductCategoryEntityFile = (0, node_fs_1.existsSync)(productCategoryEntityPath);
            expect(isExistingProductCategoryEntityFile).toBeTruthy();
            const productCategoryEntityContent = await promises_1.default.readFile(productCategoryEntityPath, 'utf-8');
            expect(productCategoryEntityContent).toContain('export class ProductCategoryEntity {');
            const notificationSettingsRepositoryPath = node_path_1.default.resolve(tempProjectPath, 'src/repositories/notification-settings-repository.ts');
            const isExistingNotificationSettingsRepositoryFile = (0, node_fs_1.existsSync)(notificationSettingsRepositoryPath);
            expect(isExistingNotificationSettingsRepositoryFile).toBeTruthy();
            const notificationSettingsRepositoryContent = await promises_1.default.readFile(notificationSettingsRepositoryPath, 'utf-8');
            expect(notificationSettingsRepositoryContent).toContain('export interface NotificationSettingsRepository {');
            const productCategoryRepositoryPath = node_path_1.default.resolve(tempProjectPath, 'src/repositories/product-category-repository.ts');
            const isExistingProductCategoryRepositoryFile = (0, node_fs_1.existsSync)(productCategoryRepositoryPath);
            expect(isExistingProductCategoryRepositoryFile).toBeTruthy();
            const productCategoryRepositoryContent = await promises_1.default.readFile(productCategoryRepositoryPath, 'utf-8');
            expect(productCategoryRepositoryContent).toContain('export interface ProductCategoryRepository {');
        });
        async function _createCustomWaysJson(content) {
            const isExistsTempProject = (0, node_fs_1.existsSync)(tempProjectPath);
            if (!isExistsTempProject) {
                await promises_1.default.mkdir(tempProjectPath, { recursive: true });
            }
            return promises_1.default.writeFile(waysJsonPath, JSON.stringify(content, null, '\t'));
        }
        function _getGlobalWaysJsonStub() {
            return jest.spyOn(promises_1.default, 'readFile').mockImplementation((filePath, ...args) => {
                const normalizedFilePath = node_path_1.default.normalize(`${filePath}`);
                const normalizedGlobalWaysJsonPath = node_path_1.default.normalize(`${globalWaysJsonPath}`);
                const isGlobalWaysJson = normalizedFilePath === normalizedGlobalWaysJsonPath;
                if (isGlobalWaysJson) {
                    return Promise.resolve(JSON.stringify({
                        templatesPath: node_path_1.default.resolve(__dirname, '../templates'),
                    }));
                }
                return originalReadFile(filePath, ...args);
            });
        }
    });
    function _getDirName() {
        const githubWorkspace = node_process_1.default.env.GITHUB_WORKSPACE;
        if (githubWorkspace) {
            return node_path_1.default.resolve(githubWorkspace, 'tests/commands');
        }
        return __dirname;
    }
});
