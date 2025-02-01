FROM node:18.18.2-alpine AS builder

RUN apk add --no-cache openssl

ARG USERNAME="appuser"

RUN addgroup --gid 1001 -S $USERNAME && \
  adduser -G $USERNAME --shell /bin/false --disabled-password -H --uid 1001 $USERNAME && \
  mkdir -p /var/log/$USERNAME && \
  chown $USERNAME:$USERNAME /var/log/$USERNAME

RUN mkdir -p /home/$USERNAME/app
RUN chown -R $USERNAME /home/$USERNAME
WORKDIR /home/$USERNAME/app

COPY package.json package-lock.json /home/$USERNAME/app/

RUN npm ci

COPY . /home/$USERNAME/app/
RUN chown -R $USERNAME /home/$USERNAME

USER $USERNAME
RUN npm run build && npm prune --prod

FROM node:18.18.2-alpine

RUN apk add --no-cache openssl

ARG USERNAME="appuser"
WORKDIR /home/$USERNAME/app

COPY --from=builder /home/$USERNAME/app/node_modules /home/$USERNAME/app/node_modules
COPY --from=builder /home/$USERNAME/app/dist /home/$USERNAME/app

ENV NODE_ENV=production
ENV PORT=5600

EXPOSE 5600

CMD ["node", "server"]
