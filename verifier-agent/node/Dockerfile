FROM node:18-alpine3.16 as builder
ENV NODE_ENV development
WORKDIR /app
COPY ./ ./
RUN npm ci --ignore-scripts
RUN npm run build && rm -rf node_modules
RUN npm ci --only=production
RUN rm -rf src deploy chart tests && find . -maxdepth 1 -type f -not -name 'package*' -delete

FROM node:18-alpine3.16 as app
ENV NODE_ENV production
WORKDIR /app
USER node
COPY --chown=node --from=builder /app ./
EXPOSE 8080
CMD npm run start:prod
