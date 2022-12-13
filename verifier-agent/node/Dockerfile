FROM node:18-alpine3.16 as builder
ENV NODE_ENV development
WORKDIR /app
COPY ./ ./
RUN npm ci --ignore-scripts
RUN npm run build && rm -rf node_modules
RUN npm ci --only=production

FROM builder as app
ENV NODE_ENV production
WORKDIR /app
USER node
COPY --chown=node --from=builder /app/dist ./dist
COPY --chown=node --from=builder /app/node_modules ./node_modules
COPY --chown=node --from=builder /app/public ./public
COPY --chown=node --from=builder /app/package.json ./
EXPOSE 8080
CMD npm run start:prod
