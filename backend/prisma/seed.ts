import { PrismaClient } from '@prisma/client';
import seedData from '../articles.json';

const prisma = new PrismaClient();

/**
 * Cria ou atualiza os autores do JSON.
 */
async function seedAuthors(data: typeof seedData) {
  const uniqueAuthors = Array.from(new Set(data.map(a => a.author)));

  const authors = await Promise.all(
    uniqueAuthors.map(name =>
      prisma.user.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  return new Map(authors.map(a => [a.name, a.id]));
}

/**
 * Cria ou atualiza todas as tags encontradas no JSON.
 */
async function seedTags(data: typeof seedData) {
  const tagsSet = new Set<string>();
  data.forEach(item => {
    [item.tag1, item.tag2, item.tag3].forEach(tag => tag && tagsSet.add(tag));
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
 * Cria ou atualiza os nossos artigos e faz o vínculo com autores e tags.
 */
async function seedArticles(
  data: typeof seedData,
  authorMap: Map<string, number>,
  tagMap: Map<string, number>
) {
  for (const item of data) {
    const authorId = authorMap.get(item.author);
    if (!authorId) continue;

    // Cria ou atualiza o nosso artigo
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

    // Vincula as nossas tags 
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

// Execução segura do noaao seed
main()
  .catch(error => {
    console.error('Ocorreu um erro ao executar o nosso seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
