#create a nodejs 16 ubuntu file
FROM node:16-bullseye

WORKDIR /app
COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run buildaudit
RUN npm run generateaudit

EXPOSE 3000

CMD ["npm", "run", "start"]
