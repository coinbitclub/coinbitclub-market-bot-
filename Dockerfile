# Dockerfile para produção
FROM node:18-alpine

# define o diretório de trabalho
WORKDIR /app

# copia os manifests e instala dependências
COPY package*.json ./
RUN npm install --production

# copia todo o código
COPY . .

# comando padrão para iniciar a app
CMD ["node", "src/index.js"]
