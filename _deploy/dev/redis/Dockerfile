FROM rediscommander/redis-commander:latest@sha256:19cd0c49f418779fa2822a0496c5e6516d0c792effc39ed20089e6268477e40a AS redis-commander

FROM redis:bookworm@sha256:ea96c435dc17b011f54c6a883c3c45e7726242b075de61c6fe40a10ae6ae0f83

RUN apt-get update && apt-get install -y curl \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

COPY --from=redis-commander /redis-commander /redis-commander
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 6379 8081

ENTRYPOINT ["/entrypoint.sh"]
CMD [ "sleep", "infinity" ]
