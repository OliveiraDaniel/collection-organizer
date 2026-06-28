import { useState, useMemo } from 'react'
import '../styles/Collection.css'

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

export default function Collection({ discos, onAdd, onDelete }) {
  const [genreFilter, setGenreFilter] = useState('')
  const [sort, setSort] = useState('addedAt-desc')

  const allGenres = useMemo(() => {
    const set = new Set()
    discos.forEach((d) => d.genres?.forEach((g) => set.add(g)))
    return [...set].sort()
  }, [discos])

  const filtered = useMemo(() => {
    let list = [...discos]

    if (genreFilter) {
      list = list.filter((d) => d.genres?.includes(genreFilter))
    }

    switch (sort) {
      case 'title-asc':  list.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'title-desc': list.sort((a, b) => b.title.localeCompare(a.title)); break
      case 'release-desc': list.sort((a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '')); break
      case 'release-asc':  list.sort((a, b) => (a.releaseDate ?? '').localeCompare(b.releaseDate ?? '')); break
      case 'addedAt-asc':  list.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt)); break
      case 'addedAt-desc':
      default: list.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)); break
    }

    return list
  }, [discos, genreFilter, sort])

  return (
    <div className="collection-page">
      <div className="collection-header">
        <h2>Minha Coleção <span className="count">({discos.length})</span></h2>
        <button className="btn-add" onClick={onAdd}>+ Adicionar</button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="genre-filter">Filtro por gênero</label>
          <select id="genre-filter" value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
            <option value="">Todos os estilos</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">Ordenação</label>
          <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="addedAt-desc">Adicionado: mais recente</option>
            <option value="addedAt-asc">Adicionado: mais antigo</option>
            <option value="title-asc">A → Z</option>
            <option value="title-desc">Z → A</option>
            <option value="release-desc">Lançamento: mais recente</option>
            <option value="release-asc">Lançamento: mais antigo</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">Nenhum disco encontrado.</p>
      ) : (
        <div className="discos-grid">
          {filtered.map((disco) => (
            <div key={disco.id} className="disco-card">
              {disco.image
                ? <img src={disco.image} alt={disco.title} className="disco-cover" />
                : <div className="disco-no-cover" />
              }
              <div className="disco-info">
                <div className="disco-title-row">
                  <h3>{disco.title}</h3>
                  <button className="btn-delete" onClick={() => onDelete(disco.id)} title="Remover">
                    <TrashIcon />
                  </button>
                </div>
                <p className="disco-artist">{disco.artist}</p>
                {disco.releaseDate && <p className="disco-year">{disco.releaseDate.slice(0, 4)}</p>}
                {disco.genres?.length > 0 && (
                  <div className="disco-genres">
                    {disco.genres.slice(0, 3).map((g) => (
                      <span key={g} className="genre-tag">{g}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
