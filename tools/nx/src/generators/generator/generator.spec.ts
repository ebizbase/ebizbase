import { Tree, formatFiles, generateFiles, logger } from '@nx/devkit';
import * as path from 'path';
import { existsSync } from 'fs';
import { generatorGenerator } from './generator';
import { GeneratorGeneratorSchema } from './schema';

jest.mock('@nx/devkit', () => ({
  formatFiles: jest.fn(),
  generateFiles: jest.fn(),
  logger: {
    error: jest.fn(),
  },
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

describe('generatorGenerator', () => {
  let tree: Tree;
  const options: GeneratorGeneratorSchema = { name: 'test-generator' };

  beforeEach(() => {
    tree = {
      root: '/root',
    } as Tree;
    jest.clearAllMocks();
  });

  it('should log an error if the generator already exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);

    await generatorGenerator(tree, options);

    expect(logger.error).toHaveBeenCalledWith('Generator test-generator already exists');
    expect(generateFiles).not.toHaveBeenCalled();
    expect(formatFiles).not.toHaveBeenCalled();
  });

  it('should generate files and format them if the generator does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);

    await generatorGenerator(tree, options);

    expect(generateFiles).toHaveBeenCalledWith(
      tree,
      path.join(__dirname, 'files'),
      path.join(__dirname, '..', 'test-generator').replace(tree.root, ''),
      options
    );
    expect(formatFiles).toHaveBeenCalledWith(tree);
    expect(logger.error).not.toHaveBeenCalled();
  });
});
