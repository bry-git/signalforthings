FROM ubuntu:latest

ENV TZ=America/Los_Angeles

RUN mkdir -p /signalforthings

RUN mkdir -p /signalforthings/attachments

WORKDIR /signalforthings

RUN apt update -y

RUN apt install wget -y

RUN apt install curl -y

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -

RUN apt install nodejs -y

RUN apt install openjdk-17-jre -y

RUN wget https://github.com/AsamK/signal-cli/releases/download/v0.10.8/signal-cli-0.10.8-Linux.tar.gz

RUN tar xf signal-cli-0.10.8-Linux.tar.gz -C /opt

RUN ln -sf /opt/signal-cli-0.10.8/bin/signal-cli /usr/local/bin/

COPY package.json /signalforthings/package.json

COPY build/signalforthings.js /signalforthings

RUN npm install

RUN rm package.json && rm package-lock.json

EXPOSE 8080

CMD [ "node", "/signalforthings/signalforthings.js"]