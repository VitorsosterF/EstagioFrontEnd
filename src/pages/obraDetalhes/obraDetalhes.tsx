import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../../services/api"
import type { Obra } from "../../types/obras"
import "./obraDetalhes.css"

function ObraDetalhe()
{
    const { id } = useParams()
    const navigate = useNavigate()
    const [obra, setObra] = useState<Obra | null>(null)

    useEffect(() => {
        api.get(`/obras/${id}`).then(res => setObra(res.data))
    }, [id])

    if (!obra) return <div className="pagina"><p className="lista-vazia">Carregando...</p></div>

    return (
        <div className="pagina">
            <button className="botao-voltar" onClick={() => navigate("/obras")}>← Voltar</button>

            <div className="detalhe-container">
                <div className="detalhe-imagem">
                    {obra.imagemUrl
                        ? <img src={`http://localhost:8080${obra.imagemUrl}`} alt={obra.nome} />
                        : <div className="detalhe-sem-imagem">📷</div>
                    }
                </div>

                <div className="detalhe-info">
                    <h1 className="detalhe-nome">{obra.nome}</h1>
                    <div className="detalhe-campo">
                        <span className="detalhe-label">Endereço</span>
                        <span className="detalhe-valor">{obra.endereco}</span>
                    </div>
                    <div className="detalhe-campo">
                        <span className="detalhe-label">Cliente responsável</span>
                        <span className="detalhe-valor">{obra.clienteResponsavel}</span>
                    </div>
                    <div className="detalhe-campo">
                        <span className="detalhe-label">Status</span>
                        <span className="detalhe-valor">{obra.status}</span>
                    </div>
                    {obra.descricao && (
                        <div className="detalhe-campo">
                            <span className="detalhe-label">Descrição</span>
                            <span className="detalhe-valor">{obra.descricao}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ObraDetalhe