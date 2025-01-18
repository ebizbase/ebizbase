FROM nginx:stable-alpine@sha256:35e3238f2f0925a505d5d697df9a9148db9a0c78e89fd2e253919047b3cec824


RUN sed -i '1idaemon off;' /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx"]
