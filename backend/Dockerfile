# garante que a imagem seja leve
FROM node:22-slim

WORKDIR /app

# Copia apenas os arquivos de dependência
COPY package*.json ./

# Instala dependências de produção
RUN npm ci --only=production

# Copia o restante do projeto
COPY . .

# Garante permissão de execução
RUN chmod +x ./entrypoint.sh

# Expõe porta
EXPOSE 3000

# Roda o shell script corretamente
CMD ["sh", "./entrypoint.sh"]
