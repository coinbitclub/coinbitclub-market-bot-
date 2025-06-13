# Dockerfile para produção
FROM node:18-alpine

WORKDIR /app

# copia e instala dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# copia todo o código
COPY . .

CMD ["node", "src/index.js"]
