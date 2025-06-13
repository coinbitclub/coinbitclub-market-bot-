# 1) usa Node.js 18 em imagem leve
FROM node:18-alpine

# 2) define diretório de trabalho
WORKDIR /app

# 3) copia manifesto e instala apenas deps de runtime
COPY package.json ./
RUN npm install --omit=dev

# 4) copia todo o resto do código
COPY . .

# 5) expõe porta (opcional, se precisar)
# EXPOSE 3000

# 6) comando padrão
CMD ["node", "src/index.js"]
