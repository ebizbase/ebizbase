FROM mongo-express AS mongo-express

FROM mongo@sha256:98028cf281bb5d49ace5e1ddbd4509e8f1382fe80ef1cf101eeefdc106d76cd4

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
