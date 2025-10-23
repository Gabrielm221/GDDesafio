import React from 'react'
import { Article } from '../types'
import ArticleCard from './ArticleCard'

const ArticleList: React.FC<{ articles: Article[] }> = ({ articles }) => {
    if (!articles.length) return <div className="p-8 text-center text-textSecondary">Nenhum artigo encontrado.</div>

    return (
        <div>
            {articles.map(a => (
                <ArticleCard key={a.id} article={a} />
            ))}
        </div>
    )
}

export default ArticleList
