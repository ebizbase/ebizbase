import type { Config } from 'release-it';

export default {
  git: {
    'changelog': 'npx auto-changelog --stdout --commit-limit false -u --template https://raw.githubusercontent.com/release-it/release-it/main/templates/changelog-compact.hbs',
    'commit': true,
    'commitMessage': 'chore: release the v${version}',
    'addUntrackedFiles': true,
    'tag': true,
    'push': true
  },
  github: {
    'release': true,
    'releaseNotes': 'npx auto-changelog --stdout --commit-limit false -u --template https://raw.githubusercontent.com/release-it/release-it/main/templates/changelog-compact.hbs'
  },
  hooks: {
    'after:bump': [
      'yq e ".version = "$VERSION"" -i deploy/staging/values.yaml',
      'yq e ".version = "$VERSION"" -i deploy/staging/Chart.yaml',
      'npx nx run-many -t publish'
    ]
  }
} satisfies Config;
