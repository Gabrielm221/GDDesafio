#!/bin/sh

echo "Aguardando o banco de dados..."

# Gera cliente Prisma
npx prisma generate

# Aplica migrações, tentando novamente se falhar
until npx prisma migrate dev --name init; do 
  echo "Falha ao aplicar as migrações. Tentando novamente em 5 segundos..."
  sleep 5
done

echo "Iniciando a aplicação..."
npm run dev
