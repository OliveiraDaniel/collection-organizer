import { useState } from 'react'
import { useForm } from 'react-hook-form'
import '../styles/SpotifySearch.css'
import { api } from '../api'

const PAGE_SIZE = 6

const GENRES = [
  'Rock', 'Pop', 'MPB', 'Eletrônica', 'Folk', 'Samba',
  'Hardcore', 'Punk', 'Heavy Metal', 'Metalcore', 'Indie',
  'Emo', 'Pop Rock', 'Rap', 'Trilha Sonora', 'Jazz',
  'Blues', 'Reggae', 'Country', 'Experimental',
]

export default function SpotifySearch({ onSubmit, onBack }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { register, handleSubmit } = useForm()

  async function fetchPage(q, pageIndex) {
    setLoading(true)
    setError(null)
    try {
      const offset = pageIndex * PAGE_SIZE
      const res = await fetch(api(`/api/spotify/search?q=${encodeURIComponent(q)}&offset=${offset}`))
      const data = await res.json()
      setResults(data.albums)
      setTotal(data.total)
      setPage(pageIndex)
    } catch {
      setError('Erro ao buscar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch() {
    if (!query.trim()) return
    setSelected(null)
    setSelectedGenres([])
    fetchPage(query, 0)
  }

  function toggleGenre(genre) {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) return prev.filter((g) => g !== genre)
      if (prev.length >= 2) return prev
      return [...prev, genre]
    })
  }

  function handleConfirm(formData) {
    onSubmit({
      spotifyId: selected.id,
      title: selected.title,
      artist: selected.artist,
      releaseDate: selected.releaseDate,
      image: selected.image,
      genres: selectedGenres,
      acquiredDate: formData.acquiredDate || null,
      addedAt: new Date().toISOString(),
    })
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
          <form onSubmit={handleSubmit(handleConfirm)}>
            <div className="preview">
              {selected.image && <img src={selected.image} alt={selected.title} className="preview-image" />}
              <div className="preview-info">
                <h3>{selected.title}</h3>
                <p>{selected.artist}</p>
                <p>{selected.releaseDate?.slice(0, 4)}</p>
              </div>
            </div>

            <button type="button" className="btn-change" onClick={() => { setSelected(null); setSelectedGenres([]) }}>
              Trocar álbum
            </button>

            <div className="field">
              <label>Gênero <span className="optional">(máx. 2)</span></label>
              <div className="genres-grid">
                {GENRES.map((genre) => {
                  const checked = selectedGenres.includes(genre)
                  const disabled = !checked && selectedGenres.length >= 2
                  return (
                    <label key={genre} className={`genre-check ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleGenre(genre)}
                      />
                      {genre}
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="field">
              <label htmlFor="acquiredDate">
                Data de aquisição <span className="optional">(opcional)</span>
              </label>
              <input id="acquiredDate" type="date" {...register('acquiredDate')} />
            </div>

            <button type="submit" className="submit">Adicionar</button>
          </form>
        )}
      </div>
    </div>
  )
}
