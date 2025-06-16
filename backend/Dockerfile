FROM node:18.20.4-alpine AS builder

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN npm run build

FROM node:18.20.4-alpine

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3030

CMD [ "node", "dist/server.js" ]