FROM mongo-express AS mongo-express

FROM mongo@sha256:3031bfad5692e3fa1defcd054d4794370889c93b2049e0c323f2b7571e495413

# Install dependencies
RUN apt-get update && apt-get install -y curl wget unzip \
  && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -y nodejs \
  && npm install -g yarn  \
  && rm -rf /var/lib/apt/lists/*

# Install mongo-express
COPY --from=mongo-express /app /mongo-express
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose MongoDB and mongo-express ports
EXPOSE 27017 8081

ENV ME_CONFIG_MONGODB_URL="mongodb://127.0.0.1:27017?directConnection=true"
ENV ME_CONFIG_MONGODB_ENABLE_ADMIN=true
ENV ME_CONFIG_BASICAUTH=false
ENV ME_CONFIG_BASICAUTH_ENABLED=false
ENV VCAP_APP_HOST="0.0.0.0"
ENV ME_CONFIG_SITE_SESSIONSECRET="secret"

# Start MongoDB, set up replica set, and run mongo-express
ENTRYPOINT ["/entrypoint.sh"]
CMD [ "sleep", "infinity" ]
