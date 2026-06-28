import { useState } from 'react'
import '../styles/SpotifySearch.css'
import { api } from '../api'

const PAGE_SIZE = 6

export default function SpotifySearch({ onSubmit, onBack }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState(null)


  async function fetchPage(q, pageIndex) {
    setLoading(true)
    setError(null)
    try {
      const page = pageIndex + 1
      const res = await fetch(api(`/api/discogs/search?q=${encodeURIComponent(q)}&page=${page}`))
      const data = await res.json()
      setResults(data.releases)
      setTotal(data.total)
      setPage(pageIndex)
      setSearched(true)
    } catch {
      setError('Erro ao buscar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    if (!query.trim()) return
    setSelected(null)
    setSearched(false)
    fetchPage(query, 0)
  }

  async function handleConfirm() {
    setSubmitting(true)
    await onSubmit({
      discogsId: selected.id,
      title: selected.title,
      artist: selected.artist,
      releaseDate: selected.releaseDate,
      image: selected.image,
      genres: selected.genres,
      addedAt: new Date().toISOString(),
    })
    setSubmitting(false)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="page">
      <div className="card spotify-card">
        <div className="spotify-header">
          <button className="btn-back-sm" onClick={onBack}>← Voltar</button>
          <h2 className="title">Adicionar Disco</h2>
        </div>

        {!selected ? (
          <>
            <div className="search-row">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar álbum..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn-search" onClick={handleSearch} disabled={loading}>
                {loading ? '...' : 'Buscar'}
              </button>
            </div>

            {error && <p className="search-error">{error}</p>}

            {!loading && searched && results.length === 0 && (
              <p className="search-empty">Nenhum álbum encontrado para "{query}".</p>
            )}

            {results.length > 0 && (
              <>
                <div className="results-grid">
                  {results.map((album) => (
                    <div key={album.id} className="result-card" onClick={() => setSelected(album)}>
                      {album.image
                        ? <img src={album.image} alt={album.title} />
                        : <div className="no-image">sem capa</div>
                      }
                      <div className="result-info">
                        <strong>{album.title}</strong>
                        <span>{album.artist}</span>
                        <span>{album.releaseDate?.slice(0, 4)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pagination">
                  <button className="btn-page" onClick={() => fetchPage(query, page - 1)} disabled={page === 0 || loading}>
                    ← Anterior
                  </button>
                  <span className="page-info">{page + 1} / {totalPages}</span>
                  <button className="btn-page" onClick={() => fetchPage(query, page + 1)} disabled={page >= totalPages - 1 || loading}>
                    Próximo →
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div>
            <div className="preview">
              {selected.image && <img src={selected.image} alt={selected.title} className="preview-image" />}
              <div className="preview-info">
                <h3>{selected.title}</h3>
                <p>{selected.artist}</p>
                <p>{selected.releaseDate?.slice(0, 4)}</p>
              </div>
            </div>

            <button type="button" className="btn-change" onClick={() => setSelected(null)}>
              Trocar álbum
            </button>

            <button type="button" className="submit" onClick={handleConfirm} disabled={submitting}>
              {submitting ? <span className="spinner" /> : 'Adicionar'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
