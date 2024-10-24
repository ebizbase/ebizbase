ARG MONGO_VERSION=4.4
FROM mongo:${MONGO_VERSION}

COPY --chown=mongodb:mongodb init-repl.sh /init-repl.sh
COPY --chown=mongodb:mongodb entrypoint.sh /entrypoint.sh

RUN chmod u+x /init-repl.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]