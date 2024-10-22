import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { LibraryGeneratorSchema } from './schema';
import { libraryGenerator as jsLibraryGenerator } from '@nx/js';

export async function libraryGenerator(tree: Tree, options: LibraryGeneratorSchema) {
  const projectRoot = `components/libraries/${options.name}`;

  await jsLibraryGenerator(tree, {
    name: options.name,
    directory: projectRoot,
    linter: 'eslint',
    bundler: 'tsc',
    unitTestRunner: 'jest',
    skipFormat: true,
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  tree.delete(`${projectRoot}/package.json`);
  await formatFiles(tree);
}

export default libraryGenerator;
