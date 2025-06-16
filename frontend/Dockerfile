FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm run build
RUN npm run build:ssr

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist/frontend/server ./dist/frontend/server

COPY --from=builder /app/dist/frontend/browser ./dist/frontend/browser

# RUN ls -la /app/dist/frontend/server

EXPOSE 4000

CMD [ "node", "dist/frontend/server/server.mjs" ]
