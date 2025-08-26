FROM node:22.18-alpine

WORKDIR /home/redacted-bot

COPY . .

RUN npm install

USER node

CMD ["npm", "run", "start"]