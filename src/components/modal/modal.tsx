import "./Modal.css"

interface ModalProps {
    aberto: boolean
    titulo: string
    onFechar: () => void
    children: React.ReactNode
}

function Modal({ aberto, titulo, onFechar, children }: ModalProps)
{
    if (!aberto) return null

    return (
        <div className="modal-overlay" onClick={onFechar}>
            <div className="modal-conteudo" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-titulo">{titulo}</h2>
                    <button className="modal-fechar" onClick={onFechar}>✕</button>
                </div>
                <div className="modal-corpo">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal