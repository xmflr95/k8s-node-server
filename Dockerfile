FROM node:14.19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 18000
CMD ["npm", "run", "start"]