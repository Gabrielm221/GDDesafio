import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import { articleService } from '../service/articleService'; 
import Header from '../components/Header';
import TagPill from '../components/TagPill'; 
import CommentSection from '../components/CommentSection';
import { formatDate } from '../utils/format'; 

const ArticleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const articleId = id;

  const { data: article, isLoading, isError, error } = useQuery({
    queryKey: ['article-detail', articleId],
    queryFn: () => articleService.get(articleId!),
    enabled: !!articleId,
  });

  if (isLoading) return <div className="p-6 text-center">Carregando artigo...</div>;
  if (isError) return <div className="p-6 text-center text-red-500">Erro: {(error as Error).message}</div>;
  if (!article) return <div className="p-6 text-center text-gray-500">Artigo não encontrado.</div>;

  const tags = (article as any)?.tags || []; 

  return (
    <div className="min-h-screen text-textPrimary">
      <Header />
      <main className="container mx-auto max-w-4xl px-6 py-10">
        <article className="prose max-w-none">
          <h1 className="text-4xl font-bold font-serif text-gray-900 mb-2">{article.title}</h1>
          <div className="text-gray-500 text-sm mb-4">
            Publicado por {article.author?.name} • {formatDate(article.createdAt)}
          </div>

          {tags.length > 0 && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {tags.map((t: any, index: number) => (
                <TagPill key={t.tag?.id || index} name={t.tag?.name || 'Sem nome'} />
              ))}
            </div>
          )}

          {(article as any).imageUrl && (
            <img 
              src={(article as any).imageUrl} 
              alt={article.title} 
              className="w-full h-auto rounded-lg mb-6"
            />
          )}

          <div className="text-gray-800 text-lg leading-relaxed mb-10 whitespace-pre-wrap">
            {article.content}
          </div>
        </article>

        <hr className="my-10 border-gray-200" />

        {/* COMENTARIOS */}
        {articleId && <CommentSection articleId={articleId} />} 
      </main>
    </div>
  );
};

export default ArticleDetailsPage;
