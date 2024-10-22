import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { toolGenerator } from './generator';
import { ToolGeneratorSchema } from './schema';
import * as path from 'path';
import * as devkit from '@nx/devkit';
import * as js from '@nx/js';
import { Tree } from '@nx/devkit';

jest.mock('@nx/js', () => ({
  libraryGenerator: jest.fn(),
}));

jest.mock('@nx/devkit', () => ({
  ...jest.requireActual('@nx/devkit'),
  formatFiles: jest.fn(),
  generateFiles: jest.fn(),
}));

describe('toolGenerator', () => {
  let tree: Tree;
  const options: ToolGeneratorSchema = { name: 'test-tool' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should call jsLibraryGenerator with correct options', async () => {
    await toolGenerator(tree, options);

    expect(js.libraryGenerator).toHaveBeenCalledWith(tree, {
      name: options.name,
      directory: `components/tools/${options.name}`,
      linter: 'eslint',
      bundler: 'tsc',
      unitTestRunner: 'jest',
      skipFormat: true,
    });
  });

  it('should generate files in the correct directory', async () => {
    await toolGenerator(tree, options);

    expect(devkit.generateFiles).toHaveBeenCalledWith(
      tree,
      path.join(__dirname, 'files'),
      `components/tools/${options.name}`,
      options
    );
  });

  it('should format files', async () => {
    await toolGenerator(tree, options);

    expect(devkit.formatFiles).toHaveBeenCalledWith(tree);
  });
});
