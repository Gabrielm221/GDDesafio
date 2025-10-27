import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Article } from '../types';
import TagPill from './TagPill';
import { formatDate } from '../utils/format';
import { useAuth } from '../hooks/useAuth'; 

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const loggedUserId = user?.id;
  const articleAuthorId = article.author?.id;

  // Verifica se o artigo pertence ao usuário logado
  const isOwner = !!user && !!articleAuthorId && (Number(articleAuthorId) === loggedUserId);

  // Define imagem principal ou placeholder
  const primaryTag = article.tags[0]?.tag.name || "Geral";
  const placeholderUrl = `https://placehold.co/80x80/E0E0E0/707070?text=${primaryTag.substring(0, 3)}`;
  const imageSource = article.imageUrl || placeholderUrl;

  const detailPath = `/article/${article.id}`;
  const editPath = `/article/edit/${article.id}`;

  return (
    <div className="flex items-start gap-4 py-4 border-b hover:bg-gray-50 transition">
      {/* Card inteiro clicável */}
      <Link to={detailPath} className="flex-1 flex items-start gap-4">
        
        {/* Imagem */}
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-tr from-[#efe9e0] to-[#e7e0d6]">
          <img
            src={imageSource}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = placeholderUrl;
              e.currentTarget.className = "w-full h-full object-center p-2";
            }}
          />
        </div>

        {/* Texto */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold">{article.title}</h3>
              <div className="text-textSecondary text-xs mt-1">
                {article.author?.name} • {formatDate(article.createdAt)}
              </div>
            </div>
          </div>

          <p className="mt-2 text-textSecondary text-sm line-clamp-2">
            {article.content.slice(0, 150)}
            {article.content.length > 150 ? '...' : ''}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {article.tags.map((t: any) => (
                <TagPill key={t.id || t.tag?.id} name={t.name || t.tag?.name || 'Sem nome'} />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Botão de edição (fora do link principal) */}
      {isOwner && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // evita abrir o link do artigo
            navigate(editPath);  // navega pro editor
          }}
          className="inline-flex items-center justify-center w-8 h-8 rounded border text-textSecondary hover:bg-gray-100"
          title="Editar artigo"
        >
          ✎
        </button>
      )}
    </div>
  );
};

export default ArticleCard;
