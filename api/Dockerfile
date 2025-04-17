#create a nodejs 16 ubuntu file
FROM node:16-bullseye

WORKDIR /root
RUN ["curl", "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip", "-o", "awscliv2.zip"]
RUN unzip awscliv2.zip
RUN ./aws/install -b /usr/bin -i /usr/local/aws-cli --update

RUN apt-get update && apt-get install -y \
    iputils-ping 

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN chmod +x scripts/entry-point.sh
ENTRYPOINT [ "scripts/entry-point.sh" ]
CMD ["npm", "run", "start-prod"]
