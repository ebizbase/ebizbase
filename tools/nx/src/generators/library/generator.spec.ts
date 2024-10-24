import { Tree } from '@nx/devkit';
import { libraryGenerator } from './generator';
import { LibraryGeneratorSchema } from './schema';
import * as path from 'path';
const generateFiles = require('@nx/devkit').generateFiles;
const formatFiles = require('@nx/devkit').formatFiles;

jest.mock('@nx/devkit', () => ({
  formatFiles: jest.fn(),
  generateFiles: jest.fn(),
}));

describe('libraryGenerator', () => {
  let tree: Tree;
  const options: LibraryGeneratorSchema = { name: 'test-lib' };

  beforeEach(() => {
    tree = {
      // Mock the Tree object methods as needed
      read: jest.fn(),
      write: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      rename: jest.fn(),
      isFile: jest.fn(),
      children: jest.fn(),
      listChanges: jest.fn(),
    } as unknown as Tree;
  });

  it('should generate files in the correct directory', async () => {

    await libraryGenerator(tree, options);

    expect(generateFiles).toHaveBeenCalledWith(
      tree,
      path.join(__dirname, 'files'),
      `libs/${options.name}`,
      options
    );
    expect(formatFiles).toHaveBeenCalledWith(tree);
  });
});
