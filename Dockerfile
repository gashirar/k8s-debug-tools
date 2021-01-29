FROM ubuntu:18.04

RUN apt-get update \
 && apt-get install stress curl wget net-tools vim dnsutils nodejs iputils-ping -y
ADD server.js /server.js

STOPSIGNAL SIGTERM

CMD ["node", "server.js"]

