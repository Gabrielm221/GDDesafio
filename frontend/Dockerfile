FROM node:22

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro
COPY package.json ./

# Instala dependências do zero (sem cache prévio do host)
RUN npm install

# Garante que dependências nativas sejam recompiladas corretamente no ambiente Linux
RUN npm rebuild

# Copia o restante do código-fonte
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
