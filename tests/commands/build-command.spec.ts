import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { rimraf } from 'rimraf';
import { buildCommand } from '../../src/commands/build-command';
import { initCommand } from '../../src/commands/init-command';
import { WaysJsonEntity } from '../../src/entities/ways-json-entity';
import { waitBuildTemplate } from '../test-helper';

describe('buildCommand', () => {
  const dirName = _getDirName();
  const tempProjectPath = path.resolve(dirName, 'temp-project-build');
  const waysJsonPath = path.resolve(tempProjectPath, 'ways.json');
  let cwdSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(async () => {
    cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(tempProjectPath);
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    await rimraf(tempProjectPath);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await rimraf(tempProjectPath);
  });

  it('should build with default ways.json configuration', async () => {
    await initCommand();
    await waitBuildTemplate();
    await buildCommand();
    await waitBuildTemplate();
    expect(logSpy.mock.calls.length).toBe(6);
    expect(logSpy.mock.calls[2][0]).toContain('Build project');
    expect(logSpy.mock.calls[3][0]).toContain('Read ways.json file');
    expect(logSpy.mock.calls[4][0]).toContain('Build template: hello');
    expect(logSpy.mock.calls[5][0]).toContain('Options:');
    expect(logSpy.mock.calls[5][1]).toEqual({ name: 'world' });
  });

  describe('custom templates', () => {
    const globalWaysJsonPath = path.resolve(os.homedir(), '.ways.json');
    const originalReadFile = fs.readFile;
    let globalWaysJsonStub: jest.SpyInstance;

    beforeEach(async () => {
      globalWaysJsonStub = _getGlobalWaysJsonStub();
      await rimraf(tempProjectPath);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should build with simple custom template', async () => {
      await _createCustomWaysJson([{
        templates: ['simple-custom-template'],
        options: [{ myVariable: 'myValue' }]
      }]);
      await waitBuildTemplate();
      await buildCommand();
      await waitBuildTemplate();
      const indexTsPath = path.resolve(tempProjectPath, 'index.ts');
      const isExistingIndexFile = existsSync(indexTsPath);
      expect(isExistingIndexFile).toBeTruthy();
      const indexFileContent = await fs.readFile(indexTsPath, 'utf-8');
      expect(indexFileContent).toContain('My simple custom template: myValue');
    });

    it('should build two templates with same options', async () => {
      await _createCustomWaysJson([{
        templates: ['entity-ts', 'repository-ts'],
        options: [{ name: 'myModule' }]
      }]);
      await waitBuildTemplate();
      await buildCommand();
      await waitBuildTemplate();
      const myModuleEntityPath = path.resolve(tempProjectPath, 'src/entities/my-module-entity.ts');
      const isExistingEntityFile = existsSync(myModuleEntityPath);
      expect(isExistingEntityFile).toBeTruthy();
      const myModuleEntityContent = await fs.readFile(myModuleEntityPath, 'utf-8');
      expect(myModuleEntityContent).toContain('export class MyModuleEntity {');
      const myModuleRepositoryPath = path.resolve(tempProjectPath, 'src/repositories/my-module-repository.ts');
      const isExistingRepositoryFile = existsSync(myModuleRepositoryPath);
      expect(isExistingRepositoryFile).toBeTruthy();
      const myModuleRepositoryContent = await fs.readFile(myModuleRepositoryPath, 'utf-8');
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
      await waitBuildTemplate();
      await buildCommand();
      await waitBuildTemplate();
      const userProfileEntityPath = path.resolve(tempProjectPath, 'src/entities/user-profile-entity.ts');
      const isExistingUserProfileEntityFile = existsSync(userProfileEntityPath);
      expect(isExistingUserProfileEntityFile).toBeTruthy();
      const userProfileEntityContent = await fs.readFile(userProfileEntityPath, 'utf-8');
      expect(userProfileEntityContent).toContain('export class UserProfileEntity {');
      const postCommentEntityPath = path.resolve(tempProjectPath, 'src/entities/post-comment-entity.ts');
      const isExistingPostCommentEntityFile = existsSync(postCommentEntityPath);
      expect(isExistingPostCommentEntityFile).toBeTruthy();
      const postCommentEntityContent = await fs.readFile(postCommentEntityPath, 'utf-8');
      expect(postCommentEntityContent).toContain('export class PostCommentEntity {');
      const purchaseOrderEntityPath = path.resolve(tempProjectPath, 'src/entities/purchase-order-entity.ts');
      const isExistingPurchaseOrderEntityFile = existsSync(purchaseOrderEntityPath);
      expect(isExistingPurchaseOrderEntityFile).toBeTruthy();
      const purchaseOrderEntityContent = await fs.readFile(purchaseOrderEntityPath, 'utf-8');
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
      await waitBuildTemplate();
      await buildCommand();
      await waitBuildTemplate();
      const notificationSettingsEntityPath = path.resolve(tempProjectPath, 'src/entities/notification-settings-entity.ts');
      const isExistingNotificationSettingsEntityFile = existsSync(notificationSettingsEntityPath);
      expect(isExistingNotificationSettingsEntityFile).toBeTruthy();
      const notificationSettingsEntityContent = await fs.readFile(notificationSettingsEntityPath, 'utf-8');
      expect(notificationSettingsEntityContent).toContain('export class NotificationSettingsEntity {');
      const productCategoryEntityPath = path.resolve(tempProjectPath, 'src/entities/product-category-entity.ts');
      const isExistingProductCategoryEntityFile = existsSync(productCategoryEntityPath);
      expect(isExistingProductCategoryEntityFile).toBeTruthy();
      const productCategoryEntityContent = await fs.readFile(productCategoryEntityPath, 'utf-8');
      expect(productCategoryEntityContent).toContain('export class ProductCategoryEntity {');
      const notificationSettingsRepositoryPath = path.resolve(tempProjectPath, 'src/repositories/notification-settings-repository.ts');
      const isExistingNotificationSettingsRepositoryFile = existsSync(notificationSettingsRepositoryPath);
      expect(isExistingNotificationSettingsRepositoryFile).toBeTruthy();
      const notificationSettingsRepositoryContent = await fs.readFile(notificationSettingsRepositoryPath, 'utf-8');
      expect(notificationSettingsRepositoryContent).toContain('export interface NotificationSettingsRepository {');
      const productCategoryRepositoryPath = path.resolve(tempProjectPath, 'src/repositories/product-category-repository.ts');
      const isExistingProductCategoryRepositoryFile = existsSync(productCategoryRepositoryPath);
      expect(isExistingProductCategoryRepositoryFile).toBeTruthy();
      const productCategoryRepositoryContent = await fs.readFile(productCategoryRepositoryPath, 'utf-8');
      expect(productCategoryRepositoryContent).toContain('export interface ProductCategoryRepository {');
    });

    async function _createCustomWaysJson(content: WaysJsonEntity) {
      const isExistsTempProject = existsSync(tempProjectPath);
      if (!isExistsTempProject) {
        await fs.mkdir(tempProjectPath, { recursive: true });
      }
      return fs.writeFile(waysJsonPath, JSON.stringify(content, null, '\t'));
    }

    function _getGlobalWaysJsonStub() {
      return jest.spyOn(fs, 'readFile').mockImplementation((filePath, ...args) => {
        const normalizedFilePath = path.normalize(`${filePath}`);
        const normalizedGlobalWaysJsonPath = path.normalize(`${globalWaysJsonPath}`);
        const isGlobalWaysJson = normalizedFilePath === normalizedGlobalWaysJsonPath;
        if (isGlobalWaysJson) {
          return Promise.resolve(JSON.stringify({
            templatesPath: path.resolve(dirName, '../templates'),
          }));
        }
        return originalReadFile(filePath, ...args);
      })
    }
  });

  function _getDirName() {
    const githubWorkspace = process.env.GITHUB_WORKSPACE;
    if (githubWorkspace) {
      return path.resolve(githubWorkspace, 'tests/commands');
    }
    return __dirname;
  }
});
