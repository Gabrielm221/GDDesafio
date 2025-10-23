import { PrismaClient } from '@prisma/client';
import seedData from '../articles.json';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const PLAIN_PASSWORD = 'seedPassword123';
const SALT_ROUNDS = 10;

// =========================================================
// FUNÇÕES DE SEED (Permanecem Corretas)
// =========================================================

/**
 * Cria ou atualiza os autores (Usuários), gerando emails e senha com hash.
 */
async function seedAuthors(data: typeof seedData) {
  console.log(`\n--- Senha de Login para Autores (Seed) ---`);
  console.log(`Senha Padrão: ${PLAIN_PASSWORD}`);
  console.log(`------------------------------------------`);
    
  const SEED_PASSWORD_HASH = await bcrypt.hash(PLAIN_PASSWORD, SALT_ROUNDS);

  const uniqueAuthors = Array.from(new Set(data.map(a => a.author)));
  const authorData: { name: string, email: string }[] = [];

  const authors = await Promise.all(
    uniqueAuthors.map(name => {
      const baseName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const defaultEmail = `${baseName}@seudominio.com`;
      
      authorData.push({ name, email: defaultEmail });
      
      return prisma.user.upsert({
        where: { name },
        update: { email: defaultEmail }, 
        create: { 
          name,
          email: defaultEmail, 
          password: SEED_PASSWORD_HASH,
        },
      })
    })
  );
  
  console.log(`\n--- Contas de Autores Criadas ---`);
  authorData.forEach(a => {
      console.log(`Nome: ${a.name} | Email: ${a.email}`);
  });
  console.log(`---------------------------------`);

  return new Map(authors.map(a => [a.name, a.id]));
}

/**
 * Cria ou atualiza todas as tags únicas encontradas no JSON.
 */
async function seedTags(data: typeof seedData) {
  const tagsSet = new Set<string>();
  data.forEach(item => {
    const tagsArray = ['tag1', 'tag2', 'tag3']
      .map(tagKey => (item as any)[tagKey])
      .filter(tag => tag && typeof tag === 'string') as string[];
    tagsArray.forEach(tag => tagsSet.add(tag));
  });

  const tags = await Promise.all(
    Array.from(tagsSet).map(name =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  return new Map(tags.map(t => [t.name, t.id]));
}

/**
 * Cria ou atualiza os artigos e associa autores e tags.
 */
async function seedArticles(
  data: typeof seedData,
  authorMap: Map<string, number>,
  tagMap: Map<string, number>
) {
  for (const item of data) {
    const authorId = authorMap.get(item.author);
    if (!authorId) continue;

    // Cria ou atualiza o artigo principal
    const article = await prisma.article.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        content: item.content,
        authorId,
      },
      create: {
        id: item.id,
        title: item.title,
        content: item.content,
        authorId,
      },
    });

    // Cria as relações N:M (ArticleOnTag)
    const tags = [item.tag1, item.tag2, item.tag3].filter(Boolean) as string[];

    for (const tagName of tags) {
      const tagId = tagMap.get(tagName);
      if (!tagId) continue;

      await prisma.articleOnTag.upsert({
        where: {
          articleId_tagId: { articleId: article.id, tagId },
        },
        update: {},
        create: { articleId: article.id, tagId },
      });
    }
  }
}

// =========================================================
// FUNÇÃO PRINCIPAL DE EXECUÇÃO
// =========================================================

/**
 * Função principal do nosso seed.
 */
async function main() {
  console.log('Iniciando o nosso seed...');

  const authorMap = await seedAuthors(seedData);
  const tagMap = await seedTags(seedData);

  await seedArticles(seedData, authorMap, tagMap);

  console.log(` Conseguimos concluir o nosso seed com ${seedData.length} artigos da Grao Direto processados.`);
}

// Execução segura do seed
main()
  .catch(error => {
    console.error('Ocorreu um erro ao executar o nosso seed:', error);
    // SAI COM CÓDIGO DE ERRO (1) APENAS SE HOUVER FALHA
  })
  .finally(async () => {
    await prisma.$disconnect();
    // O script termina aqui naturalmente se não houve erro.
  });
