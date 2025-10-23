import React from 'react'

type Props = {
  page: number
  pageCount?: number
  onChange: (p: number) => void
  maxButtons?: number 
}

const Pagination: React.FC<Props> = ({ page, pageCount = 1, onChange, maxButtons = 5 }) => {
  if (pageCount <= 1) return null

  const handle = (p: number) => {
    if (p < 1 || p > pageCount || p === page) return
    onChange(p)
  }

  // LOGICA PARA A JANELA DE PAGI0NAS COM ECLIPSE
  const visible = Math.min(maxButtons, pageCount)
  let start = Math.max(1, page - Math.floor(visible / 2))
  let end = start + visible - 1
  if (end > pageCount) {
    end = pageCount
    start = Math.max(1, end - visible + 1)
  }

  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <nav className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => handle(page - 1)}
        className="px-3 py-1 rounded-md border bg-white text-textPrimary disabled:opacity-50"
        disabled={page === 1}
      >
        ‹
      </button>
      {start > 1 && (
        <>
          <button onClick={() => handle(1)} className="px-3 py-1 rounded-full bg-white border">{1}</button>
          {start > 2 && <span className="px-2">…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          onClick={() => handle(p)}
          className={`px-3 py-1 rounded-full border ${p === page ? 'bg-primary text-white' : 'bg-white text-textPrimary'}`}
        >
          {p}
        </button>
      ))}

      {/* ECLIPSE + ULTIMA PAGINA */}
      {end < pageCount && (
        <>
          {end < pageCount - 1 && <span className="px-2">…</span>}
          <button onClick={() => handle(pageCount)} className="px-3 py-1 rounded-full border">{pageCount}</button>
        </>
      )}

      <button
        onClick={() => handle(page + 1)}
        className="px-3 py-1 rounded-md border bg-white text-textPrimary disabled:opacity-50"
        disabled={page === pageCount}
      >
        ›
      </button>
    </nav>
  )
}

export default Pagination
