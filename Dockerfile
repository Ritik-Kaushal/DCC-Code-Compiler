FROM ubuntu:18.04
FROM node:18

RUN dpkg --configure -a

ENV PYTHON_VERSION 3.7.7
ENV PYTHON_PIP_VERSION 20.1
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get -y install gcc nodejs npm \
    curl && \
    rm -rf /var/lib/apt/lists/*

# ENV NODE_VERSION=16.13.2
# RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
# ENV NVM_DIR=/root/.nvm
# RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
# RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
# RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
# ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
# RUN nvm install 16.13.2

# install redis
RUN apt-get update
RUN apt-get install -y redis-server
RUN apt-get install -y redis-tools



COPY . /app
WORKDIR /app
RUN npm install

EXPOSE 3000

# run the redis server in the background and start the node server
CMD redis-server & npm start
# CMD ["npm", "start"]