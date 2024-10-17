const { getProjects } = require('nx/src/generators/utils/project-configuration.js');
const { FsTree } = require('nx/src/generators/tree.js');

const projects = getProjects(new FsTree(__dirname, false));
const projectScopes = Object.keys(projects).reduce((acc, name) => {
  acc[name] = `for changes of  project ${name} within the directory ${projects.get(name).root}`;
  return acc;
}, {});

module.exports = {
  MIN_LENGTH:10,
  MAX_LENGTH:100,
  TYPES: {
    feat: 'A new feature',
    fix: 'A bug fix',
    docs: 'Documentation only changes',
    refactor: 'A code change that neither fixes a bug nor adds a feature',
    perf: 'A code change that improves performance',
    test: 'Adding missing tests or correcting existing tests',
    build: 'Changes that affect the build system or external dependencies',
    ci: 'Changes to our CI configuration files and scripts',
    chore: 'Other changes that don’t modify src or test files',
    revert: 'Reverts a previous commit',
  },
  SCOPES: {
    ...projectScopes,
    'deps': 'used for changes to the dependencies of the project',
    'dev-infra': 'used for dev-infra related changes within the directories /tools and /scripts',
    '': 'empty/none scope useful for `test` and `refactor` changes that are done across all packages (e.g. `test: add missing unit tests`) and for docs changes that are not related to a specific package (e.g. `docs: fix typo in tutorial`)',
  },
};

if (require.main === module) {
  console.log(module.exports);
}
