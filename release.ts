import type { Config } from 'release-it';

export default {
  git: {
    'changelog': 'npx auto-changelog --stdout --commit-limit false -u --template https://raw.githubusercontent.com/release-it/release-it/main/templates/changelog-compact.hbs',
    'requireCleanWorkingDir': false,
    'commit': true,
    'commitMessage': 'chore: release the v${version}',
    'addUntrackedFiles': true,
    'tag': true,
    'push': true
  },
  github: {
    'release': true,
    'releaseNotes': 'npx auto-changelog --stdout --commit-limit false -u --template https://raw.githubusercontent.com/release-it/release-it/main/templates/changelog-compact.hbs'
  }
} satisfies Config;
