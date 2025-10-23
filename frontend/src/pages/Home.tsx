import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import ArticleList from '../components/ArticleList'
import Pagination from '../components/Pagination'
import { articleService } from '../service/articleService'
import { useDebounce } from '../hooks/useDebounce'
import type { Article } from '../types'
import { Link } from 'react-router-dom'
import { useLoggedCheck } from '../components/useLoggedCheck'

//TAGS CRIADAS POR NOS, ASSIM COMO NO FIGMA

const TAGS = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'AI']

const Home: React.FC = () => {
  useLoggedCheck();

  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // Paginação frontend
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const debouncedSearch = useDebounce(search, 600)

  // BUSCAR ARTIGOS NO BACKEND
  async function fetchArticles() {
    setLoading(true)
    setError(null)
    try {
      const params: Record<string, any> = {}
      if (debouncedSearch) params.search = debouncedSearch
      if (activeTag) params.tag = activeTag

      const res = await articleService.list(params)
      setArticles(res.data ?? [])
      setCurrentPage(1) // resetar página ao filtrar
    } catch (err: any) {
      console.error(err)
      setError('Erro ao carregar artigos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [debouncedSearch, activeTag])

  // PAGINACAO FRONTEND, FATIAR OS NOSSOS ARQUIVOS
  const totalPages = Math.ceil(articles.length / pageSize)
  const paginatedArticles = articles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="min-h-screen text-textPrimary">
      <Header />
      <main className="container px-6 py-10">
        {/* TITULO E CRIAR ARTIGO */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-serif font-bold">Todos os artigos</h2>
          <Link
            to="/article/new"
            className="inline-block px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700"
          >
            Criar artigo
          </Link>
        </div>

        {/* TAGS */}
        <div className="mb-6 flex flex-wrap gap-3">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() =>
                setActiveTag(activeTag === tag ? null : tag)
              }
              className={`px-3 py-1 rounded-full border text-sm transition 
                ${activeTag === tag ? 'bg-primary text-white' : 'bg-white text-textSecondary hover:bg-accent/10'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* BUSCA */}
        <div className="mb-6 relative">
          <input
            placeholder="Pesquisar artigos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg p-4 bg-[#eef6ea] border-none text-textSecondary focus:ring-2 focus:ring-primary"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-3 text-textSecondary hover:text-textPrimary text-lg"
            >
              ✕
            </button>
          )}
        </div>

        {/* CONTEUDO */}
        {loading && <div className="p-6 text-center">Carregando...</div>}
        {error && <div className="p-6 text-center text-red-500">{error}</div>}

        {!loading && !error && (
          <>
            {articles.length > 0 ? (
              <>
                <ArticleList articles={paginatedArticles} />

                {/* PAGINACAO */}
                <div className="flex justify-center mt-8">
                  <Pagination
                    page={currentPage}
                    pageCount={totalPages}
                    onChange={p => setCurrentPage(p)}
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-textSecondary py-12">
                Nenhum artigo encontrado
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Home
