
const {TYPES, SCOPES,MIN_LENGTH, MAX_LENGTH}  = require('./commit-rules.js');

module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', MAX_LENGTH],
        'header-min-length': [2, 'always', MIN_LENGTH],
        'body-max-line-length': [2, 'always', MAX_LENGTH],
        'footer-max-length': [2, 'always', MAX_LENGTH],
        'type-enum': [2, 'always', Object.keys(TYPES) ],
        'scope-enum': async (ctx) => [2,'always', Object.keys(SCOPES)],
    },
};

