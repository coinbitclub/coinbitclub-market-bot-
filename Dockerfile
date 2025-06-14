# Use imagem oficial do Node.js
FROM node:18

WORKDIR /app

# Instala só o que precisa para rodar
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Porta padrão para Railway/Heroku/Render
EXPOSE 3000

# Comando padrão
CMD ["npm", "start"]
