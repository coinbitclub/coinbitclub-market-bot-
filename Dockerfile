FROM node:18-alpine
WORKDIR /app

# só deps de produção
COPY package.json ./
RUN npm install --omit=dev

# copia todo o resto do código
COPY . .

CMD ["node", "src/index.js"]
