FROM node:16.17.0-alpine3.16 AS build-stage

RUN apk update && apk upgrade && apk --no-cache add --virtual builds-deps build-base python3

RUN addgroup app && adduser -S -G app app
RUN mkdir /app && chown app:app /app
USER app
WORKDIR /app

COPY --chown=app:app package*.json ./
COPY --chown=app:app patches ./patches/
RUN npm ci

COPY --chown=app:app . .

RUN npm run build
RUN npm prune --production

EXPOSE 4000
CMD ["npm", "run", "start"]

