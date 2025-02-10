FROM node:22-alpine@sha256:6e80991f69cc7722c561e5d14d5e72ab47c0d6b6cfb3ae50fb9cf9a7b30fdf97
ENV PORT=3000
ENV NODE_ENV=development
CMD ["npx", "ts-node-dev","--transpile-only", "--respawn", "-r", "tsconfig-paths/register","src/main.ts" ]
