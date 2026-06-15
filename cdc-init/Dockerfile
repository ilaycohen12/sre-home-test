FROM alpine:3.19
RUN apk add --no-cache curl dos2unix
COPY init.sh /init.sh
RUN dos2unix /init.sh && chmod +x /init.sh
ENTRYPOINT ["/init.sh"]
