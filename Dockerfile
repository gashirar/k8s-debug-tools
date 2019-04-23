FROM ubuntu:18.04

RUN apt update \
 && apt install stress curl wget net-tools vim dnsutils nodejs -y
ADD server.js /server.js

EXPOSE 80
STOPSIGNAL SIGTERM

CMD ["node", "server.js"]
# CMD sleep infinity

