# Dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package.json ./
# veja se há lockfile: se tiver, copie também; senão, use install
COPY package-lock.json ./
RUN npm install --omit=dev

COPY . .
CMD ["node", "src/index.js"]
