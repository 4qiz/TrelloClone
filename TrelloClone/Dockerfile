FROM node:20.12.0-alpine3.19 AS dependencies
WORKDIR /TrelloClone
COPY package.json ./
RUN npm install

FROM node:20.12.0-alpine3.19 AS builder
WORKDIR /TrelloClone
COPY . .
COPY --from=dependencies /TrelloClone/node_modules ./node_modules

RUN npx prisma generate && npx prisma db push && npm run build

FROM node:20.12.0-alpine3.19 AS runner
WORKDIR /TrelloClone
ENV NODE_ENV production

COPY --from=builder /TrelloClone/public ./public
COPY --from=builder /TrelloClone/package.json ./package.json
COPY --from=builder /TrelloClone/.next ./.next
COPY --from=builder /TrelloClone/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]