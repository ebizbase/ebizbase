FROM busybox@sha256:a5d0ce49aa801d475da48f8cb163c354ab95cab073cd3c138bd458fc8257fbf1 AS tools
ARG BUSYBOX_VERSION=1.31.0-i686-uclibc
ADD https://busybox.net/downloads/binaries/$BUSYBOX_VERSION/busybox_WGET /wget
RUN chmod a+x /wget

FROM node:22-alpine@sha256:9bef0ef1e268f60627da9ba7d7605e8831d5b56ad07487d24d1aa386336d1944 AS build
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
