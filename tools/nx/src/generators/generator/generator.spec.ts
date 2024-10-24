import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from './generator';
import { GeneratorGeneratorSchema } from './schema';
import * as path from 'path';
import * as devkit from '@nx/devkit';
import { Tree } from '@nx/devkit';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';

jest.mock('@nx/js', () => ({
  libraryGenerator: jest.fn(),
}));

describe('libraryGenerator', () => {
  let tree: Tree;
  const options: GeneratorGeneratorSchema = { name: 'test-lib' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.clearAllMocks();
  });

  it('should call jsLibraryGenerator with correct options', async () => {
    await libraryGenerator(tree, options);

    expect(jsLibraryGenerator).toHaveBeenCalledWith(tree, {
      name: options.name,
      directory: `components/libraries/${options.name}`,
      linter: 'eslint',
      bundler: 'tsc',
      unitTestRunner: 'jest',
      skipFormat: true,
    });
  });

  it('should generate files in the correct directory', async () => {
    const generateFilesSpy = jest.spyOn(devkit, 'generateFiles');

    await libraryGenerator(tree, options);

    expect(generateFilesSpy).toHaveBeenCalledWith(
      tree,
      path.join(__dirname, 'files'),
      `components/libraries/${options.name}`,
      options
    );
  });

  it('should format files', async () => {
    const formatFilesSpy = jest.spyOn(devkit, 'formatFiles');

    await libraryGenerator(tree, options);

    expect(formatFilesSpy).toHaveBeenCalledWith(tree);
  });
});
