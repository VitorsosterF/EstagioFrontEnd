import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../../services/api"
import type { Obra } from "../../types/obras"
import Modal from "../../components/modal/modal"
import "./obraDetalhes.css"
import { Pencil, Trash2 } from "lucide-react"

function ObraDetalhe()
{
    const { id } = useParams()
    const navigate = useNavigate()
    const [obra, setObra] = useState<Obra | null>(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [form, setForm] = useState<Obra | null>(null)
    const [imagem, setImagem] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [usuarios, setUsuarios] = useState<{ id: number, nome: string, sobrenome: string }[]>([])

    useEffect(() =>
    {
        api.get(`/obras/${id}`).then(res => setObra(res.data))
        api.get("/usuarios").then(res => setUsuarios(res.data))
    }, [id])

    function abrirModalEdicao()
    {
        if (!obra) return
        setForm(obra)
        setPreview(obra.imagemUrl ? `http://localhost:8080${obra.imagemUrl}` : null)
        setImagem(null)
        setModalAberto(true)
    }

    function fecharModal()
    {
        setModalAberto(false)
        setForm(null)
        setImagem(null)
        setPreview(null)
    }

    function handleImagemChange(e: React.ChangeEvent<HTMLInputElement>)
    {
        const arquivo = e.target.files?.[0]
        if (arquivo)
        {
            setImagem(arquivo)
            setPreview(URL.createObjectURL(arquivo))
        }
    }

    async function handleSubmit(e: React.FormEvent)
    {
        e.preventDefault()
        if (!form) return
        try
        {
            const formData = new FormData()
            formData.append("obra", JSON.stringify(form))
            if (imagem) formData.append("imagem", imagem)
            const res = await api.put(`/obras/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            setObra(res.data)
            fecharModal()
        }
        catch
        {
            alert("Erro ao salvar obra.")
        }
    }

    async function handleDelete()
    {
        if (!confirm("Deseja excluir esta obra?")) return
        try
        {
            await api.delete(`/obras/${id}`)
            navigate("/obras")
        }
        catch
        {
            alert("Erro ao excluir obra.")
        }
    }

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
                    <div className="detalhe-header">
                        <h1 className="detalhe-nome">{obra.nome}</h1>
                        <div className="detalhe-acoes">
                            <button className="botao-editar" onClick={abrirModalEdicao}><Pencil size={15} /></button>
                            <button className="botao-excluir" onClick={handleDelete}><Trash2 size={15} /></button>
                        </div>
                    </div>

                    <div className="detalhe-campo">
                        <span className="detalhe-label">Endereço</span>
                        <span className="detalhe-valor">
                            {obra.rua}, {obra.numero}{obra.complemento ? ` - ${obra.complemento}` : ""}
                        </span>
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

            {form && (
                <Modal aberto={modalAberto} titulo="Editar obra" onFechar={fecharModal}>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-grid">
                            <input placeholder="Nome da obra" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required className="input" />
                            <input placeholder="Rua" value={form.rua} onChange={e => setForm({ ...form, rua: e.target.value })} required className="input" />
                            <input placeholder="Número" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} required className="input" />
                            <input placeholder="Complemento" value={form.complemento} onChange={e => setForm({ ...form, complemento: e.target.value })} className="input" />
                            <select value={form.clienteResponsavel} onChange={e => setForm({ ...form, clienteResponsavel: e.target.value })} required className="input">
                                <option value="" disabled>Selecionar cliente responsável</option>
                                {usuarios.map(u => (
                                    <option key={u.id} value={`${u.nome} ${u.sobrenome}`}>{u.nome} {u.sobrenome}</option>
                                ))}
                            </select>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} required className="input">
                                <option value="Não iniciada">Não iniciada</option>
                                <option value="Em andamento">Em andamento</option>
                                <option value="Concluída">Concluída</option>
                                <option value="Pausada">Pausada</option>
                            </select>
                        </div>
                        <textarea
                            placeholder="Descrição"
                            value={form.descricao}
                            onChange={e => setForm({ ...form, descricao: e.target.value })}
                            rows={3}
                            style={{ backgroundColor: "#212529", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", color: "white", width: "100%", resize: "none", outline: "none" }}
                        />
                        <div className="upload-area">
                            {preview && <img src={preview} alt="preview" className="upload-preview" />}
                            <label className="upload-label">
                                {preview ? "Trocar imagem" : "Adicionar imagem"}
                                <input type="file" accept="image/*" onChange={handleImagemChange} style={{ display: "none" }} />
                            </label>
                        </div>
                        <div className="botoes">
                            <button type="submit" className="botao-primario">Salvar alterações</button>
                            <button type="button" className="botao-secundario" onClick={fecharModal}>Cancelar</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default ObraDetalhe