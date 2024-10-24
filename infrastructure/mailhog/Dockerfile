FROM mailhog/mailhog:latest

USER root

RUN apk add --no-cache curl jq

COPY clean_mail.sh /clean_mail.sh
RUN chmod +x /clean_mail.sh

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
