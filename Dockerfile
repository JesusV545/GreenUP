FROM node:18-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production
ENV RUN_MIGRATIONS=true

RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]
