FROM busybox@sha256:ab33eacc8251e3807b85bb6dba570e4698c3998eca6f0fc2ccb60575a563ea74 AS tools
ARG BUSYBOX_VERSION=1.31.0-i686-uclibc
ADD https://busybox.net/downloads/binaries/$BUSYBOX_VERSION/busybox_WGET /wget
RUN chmod a+x /wget

FROM node:22-alpine@sha256:6e80991f69cc7722c561e5d14d5e72ab47c0d6b6cfb3ae50fb9cf9a7b30fdf97 AS build
WORKDIR /app
COPY dist/apps/iam-service/package.json .
COPY dist/apps/iam-service/yarn.lock .
RUN yarn install --frozen-lockfile


FROM ghcr.io/ebizbase/node-distroless:latest@sha256:2d35608f1516d8f86b2d4bfbf0c8c2c80c4c820f227cf707b96407f5f369f9f8

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

WORKDIR /app
COPY --from=tools /wget /usr/bin/wget
COPY --from=build /app/node_modules ./node_modules
COPY dist/apps/iam-service .
CMD [ "main.js" ]
