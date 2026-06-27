import '../styles/SuccessModal.css'

export default function SuccessModal({ onAddAnother, onViewCollection }) {
  return (
    <div className="overlay">
      <div className="modal">
        <div className="icon">✓</div>
        <h3>Item cadastrado com sucesso!</h3>
        <p>O que deseja fazer agora?</p>
        <div className="actions">
          <button className="btn-secondary" onClick={onAddAnother}>
            Cadastrar outro item
          </button>
          <button className="btn-primary" onClick={onViewCollection}>
            Ver minha coleção
          </button>
        </div>
      </div>
    </div>
  )
}
