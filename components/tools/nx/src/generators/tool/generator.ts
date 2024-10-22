import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { ToolGeneratorSchema } from './schema';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';

export async function toolGenerator(tree: Tree, options: ToolGeneratorSchema) {
  const projectRoot = `components/tools/${options.name}`;

  await jsLibraryGenerator(tree, {
    name: options.name,
    directory: projectRoot,
    linter: 'eslint',
    bundler: 'tsc',
    unitTestRunner: 'jest',
    skipFormat: true,
  });

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}

export default toolGenerator;
