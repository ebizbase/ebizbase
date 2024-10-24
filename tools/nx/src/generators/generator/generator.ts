import { formatFiles, generateFiles, Tree, logger } from '@nx/devkit';
import * as path from 'path';
import { GeneratorGeneratorSchema } from './schema';
import { existsSync } from 'fs';

export async function generatorGenerator(tree: Tree, options: GeneratorGeneratorSchema) {
  const generatorRoot = path.join(__dirname, '..', options.name);
  if (existsSync(generatorRoot)) {
    logger.error(`Generator ${options.name} already exists`);
  }
  generateFiles(tree, path.join(__dirname, 'files'), generatorRoot.replace(tree.root, ''), options);
  await formatFiles(tree);
}

export default generatorGenerator;
