import { useState, useEffect } from 'react'
import './styles/App.css'
import Header from './components/Header'
import Collection from './components/Collection'
import SpotifySearch from './components/SpotifySearch'
import SuccessModal from './components/SuccessModal'
import { api } from './api'

function App() {
  const [discos, setDiscos] = useState([])
  const [view, setView] = useState('collection')
  const [showModal, setShowModal] = useState(false)
  const [addKey, setAddKey] = useState(0)

  useEffect(() => {
    fetch(api('/api/discos'))
      .then((r) => r.json())
      .then(setDiscos)
      .catch(console.error)
  }, [])

  async function handleAddDisco(data) {
    const newDisco = { id: crypto.randomUUID(), ...data }
    await fetch(api('/api/discos'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDisco),
    })
    setDiscos((prev) => [newDisco, ...prev])
    setShowModal(true)
  }

  async function handleDeleteDisco(id) {
    await fetch(api(`/api/discos/${id}`), { method: 'DELETE' })
    setDiscos((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <>
      <Header />
      <main>
        {view === 'collection' && (
          <Collection
            discos={discos}
            onAdd={() => setView('add')}
            onDelete={handleDeleteDisco}
          />
        )}
        {view === 'add' && (
          <SpotifySearch
            key={addKey}
            onSubmit={handleAddDisco}
            onBack={() => setView('collection')}
          />
        )}
      </main>

      {showModal && (
        <SuccessModal
          onAddAnother={() => { setShowModal(false); setAddKey((k) => k + 1) }}
          onViewCollection={() => { setShowModal(false); setView('collection') }}
        />
      )}
    </>
  )
}

export default App
