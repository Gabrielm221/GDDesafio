import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../types';
import TagPill from './TagPill';
import { formatDate } from '../utils/format';
import { useAuth } from '../hooks/useAuth'; 

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const { user } = useAuth(); 

  const loggedUserId = user?.id;
  const articleAuthorId = article.author?.id;
  
  // LOGICA DA PROPRIEDADE
  const isOwner = 
    !!user && 
    !!articleAuthorId && 
    (Number(articleAuthorId) === loggedUserId);

  // AQUI PRA NAO FICAR VAZIO, USAMOS A LOGICA : USA O LINK QUE COLOCAMOS OU O PLACEHOLDER DA IMAGEM
  const primaryTag = article.tags[0]?.tag.name || "Geral";
  const placeholderUrl = `https://placehold.co/80x80/E0E0E0/707070?text=${primaryTag.substring(0, 3)}`;

  const imageSource = article.imageUrl || placeholderUrl;

  const detailPath = `/article/${article.id}`;
  const editPath = `/article/edit/${article.id}`;


  return (
    // Link principal
    <Link to={detailPath} className="block"> 
      <div className="flex items-start gap-4 py-4 border-b hover:bg-gray-50 transition">
        
        {/* RENDERIZACAO DA IMAGEM */}
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-tr from-[#efe9e0] to-[#e7e0d6]">
            <img
                // USA A URL PARA O PLACEHOLDER
                src={imageSource} 
                alt={article.title}
                className="w-full h-full object-cover" // OCUPA TODO DIV
                onError={(e) => {
                    // FALLBACK PARA A URL SIMPLES SE O PLACEHOLDER FALHAR
                    e.currentTarget.src = placeholderUrl; 
                    e.currentTarget.className = "w-full h-full object-center p-2"; // AJUSTA O PADDING DO FALLBACK
                }}
            />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold">{article.title}</h3>
              <div className="text-textSecondary text-xs mt-1">
                {article.author?.name} • {formatDate(article.createdAt)}
              </div>
            </div>

            <div className="ml-4">
              {/* RRENDERIZACAO CONDICIONAL */}
              {isOwner && (
                <Link
                  to={editPath} 
                  onClick={e => e.stopPropagation()} 
                  className="inline-flex items-center justify-center w-8 h-8 rounded border text-textSecondary hover:bg-gray-100"
                >
                  ✎
                </Link>
              )}
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
      </div>
    </Link>
  )
}

export default ArticleCard;