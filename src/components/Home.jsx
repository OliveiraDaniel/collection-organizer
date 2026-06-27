import '../styles/Home.css'

export default function Home({ onAdd, onView }) {
  return (
    <div className="home">
      <div className="home-content">
        <h2>Sua coleção de discos</h2>
        <p>Organize, explore e descubra sua música.</p>
        <div className="home-actions">
          <button className="btn-primary" onClick={onAdd}>+ Adicionar disco</button>
          <button className="btn-secondary" onClick={onView}>Ver coleção</button>
        </div>
      </div>
    </div>
  )
}
