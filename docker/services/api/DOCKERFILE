FROM ubuntu

RUN apt-get update
RUN apt-get -y install curl git unzip
ENV TOPS_DEPLOY_ENV=php71
RUN mkdir scripts
WORKDIR /scripts
RUN curl -o docker.sh https://raw.githubusercontent.com/teemops/templates/master/scripts/docker.sh
RUN cat docker.sh
RUN chmod +x docker.sh
RUN bash
RUN sh docker.sh

