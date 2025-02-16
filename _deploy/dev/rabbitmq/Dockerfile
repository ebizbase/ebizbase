FROM rabbitmq:management-alpine@sha256:74bf73c53b9600c08f677ea809c742dcaf57a6bf83af435bae16d01d2be9ed31

RUN apk add --no-cache curl && rm -rf /var/cache/apk/*

RUN curl -sfL -o /opt/rabbitmq/plugins/rabbitmq_delayed_message_exchange.ez https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v4.0.2/rabbitmq_delayed_message_exchange-4.0.2.ez

RUN rabbitmq-plugins enable rabbitmq_delayed_message_exchange
