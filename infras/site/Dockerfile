FROM node:22-alpine@sha256:6e80991f69cc7722c561e5d14d5e72ab47c0d6b6cfb3ae50fb9cf9a7b30fdf97
ENV NX_DAEMON=false
ENV NX_CACHE_DIRECTORY=/tmp/nx-cache
ENV NX_WORKSPACE_DATA_DIRECTORY=/tmp/nx-workspace-data
WORKDIR /workspace
CMD npx nx serve $PROJECT --port 80


