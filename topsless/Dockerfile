FROM node:18-bullseye

RUN npm install -g aws-sdk

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "run", "debug"]