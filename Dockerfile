FROM node:20.12.0-alpine3.19 AS dependencies
WORKDIR /restaurant
COPY package.json ./
RUN npm install

FROM node:20.12.0-alpine3.19 AS builder
WORKDIR /restaurant
COPY . .
COPY --from=dependencies /restaurant/node_modules ./node_modules
##RUN npx prisma generate && npm run build
RUN npx prisma generate && npx prisma db push && npx prisma db seed && npm run build

FROM node:20.12.0-alpine3.19 AS runner
WORKDIR /restaurant
ENV NODE_ENV production

COPY --from=builder /restaurant/public ./public
COPY --from=builder /restaurant/package.json ./package.json
COPY --from=builder /restaurant/.next ./.next
COPY --from=builder /restaurant/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]