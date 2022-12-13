FROM nginxinc/nginx-unprivileged:1.20-alpine-perl

ARG BUILD_VERSION=0.1

LABEL org.opencontainers.image.version=$BUILD_VERSION \
      org.opencontainers.image.authors="airenass@gmail.com" \
      name="tts-gui" \
      maintainer="airenass@gmail.com" \
      vendor="airenass@gmail.com" \
      version=$BUILD_VERSION \
      release=$BUILD_VERSION \
      summary="This image is used to start LiST GUI HTML service" \
      description="LiST GUI service runtime based on nginx" 

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/html /usr/share/nginx/html
COPY set_env.sh /docker-entrypoint.d/

USER root

RUN chown nginx:nginx /usr/share/nginx/html/* /usr/share/nginx/html/trans/* /usr/share/nginx/html

USER nginx
