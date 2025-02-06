FROM busybox AS tools
ARG BUSYBOX_VERSION=1.31.0-i686-uclibc
ADD https://busybox.net/downloads/binaries/$BUSYBOX_VERSION/busybox_WGET /wget
RUN chmod a+x /wget

FROM ghcr.io/ebizbase/node-distroless:latest@sha256:2d35608f1516d8f86b2d4bfbf0c8c2c80c4c820f227cf707b96407f5f369f9f8
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
COPY --from=tools /wget /usr/bin/wget
COPY dist/apps/my-account-site .
CMD [ "server/main.js" ]
