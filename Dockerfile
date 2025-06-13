Dockerfile para produção
FROM node:18-alpine

diretório de trabalho
WORKDIR /app

copiar manifestos e instalar dependências
COPY package*.json ./
RUN npm install --production

copiar código-fonte
COPY . .

comando de inicialização
CMD ["node", "src/index.js"]
