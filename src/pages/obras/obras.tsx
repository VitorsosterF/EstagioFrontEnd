import { useEffect, useState } from "react"
import { api } from "../../services/api"
import type { Obra } from "../../types/obras"
import Modal from "../../components/modal/modal"
import "./Obras.css"
import { useNavigate } from "react-router-dom"

const formVazio: Obra = { nome: "", rua: "", numero: "", complemento: "", clienteResponsavel: "", status: "", descricao: "" }

function Obras()
{
    const [obras, setObras] = useState<Obra[]>([])
    const [edicaoId, setEdicaoId] = useState<number | null>(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [form, setForm] = useState<Obra>(formVazio)
    const [imagem, setImagem] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [usuarios, setUsuarios] = useState<{ id: number, nome: string, sobrenome: string }[]>([])
    const navigate = useNavigate()

    async function carregarObras()
    {
        const respostaApi = await api.get("/obras")
        setObras(respostaApi.data)
    }

    async function carregarUsuarios()
    {
        const respostaApi = await api.get("/usuarios")
        setUsuarios(respostaApi.data)
    }

    useEffect(() =>
    {
        carregarObras()
        carregarUsuarios()
    }, [])

    function abrirModalCriacao()
    {
        setForm(formVazio)
        setEdicaoId(null)
        setImagem(null)
        setPreview(null)
        setModalAberto(true)
    }

    function abrirModalEdicao(obra: Obra, e: React.MouseEvent)
    {
        setForm(obra)
        setEdicaoId(obra.id!)
        setImagem(null)
        setPreview(obra.imagemUrl ? `http://localhost:8080${obra.imagemUrl}` : null)
        setModalAberto(true)
    }

    function fecharModal()
    {
        setModalAberto(false)
        setEdicaoId(null)
        setImagem(null)
        setPreview(null)
        setForm(formVazio)
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
        try 
        {
            const formData = new FormData()
            formData.append("obra", JSON.stringify(form))
            if (imagem) formData.append("imagem", imagem)

            if (edicaoId)
            {
                await api.put(`/obras/${edicaoId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
            }
            else
            {
                await api.post("/obras", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
            }
            fecharModal()
            carregarObras()
        } catch (error) 
        {
            alert("Erro ao salvar obra. Verifique os dados e tente novamente.")
        }
    }

    async function handleDelete(id: number, e: React.MouseEvent) 
    {
        e.stopPropagation()
        if (!confirm("Deseja excluir esta obra?")) return
        try
        {
            await api.delete(`/obras/${id}`)
            carregarObras()
        }
        catch
        {
            alert("Erro ao excluir obra.")
        }
    }


    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="titulo">Gerenciamento de Obras</h1>
                <button className="botao-primario" onClick={abrirModalCriacao}>+ Nova obra</button>
            </div>

            <Modal
                aberto={modalAberto}
                titulo={edicaoId ? "Editar obra" : "Nova obra"}
                onFechar={fecharModal}
            >
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-grid">
                        <input placeholder="Nome da obra" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required className="input" />
                        <input placeholder="Rua" value={form.rua} onChange={e => setForm({ ...form, rua: e.target.value })} required className="input" />
                        <input placeholder="Número" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} required className="input" />
                        <input placeholder="Complemento" value={form.complemento} onChange={e => setForm({ ...form, complemento: e.target.value })} className="input" />
                        <select
                            value={form.clienteResponsavel}
                            onChange={e => setForm({ ...form, clienteResponsavel: e.target.value })}
                            required
                            className="input"
                        >
                            <option value="" disabled>Selecionar cliente responsável</option>
                            {usuarios.map(u => (
                                <option key={u.id} value={`${u.nome} ${u.sobrenome}`}>
                                    {u.nome} {u.sobrenome}
                                </option>
                            ))}
                        </select>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} required className="input">
                            <option value="" disabled>Selecionar status</option>
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
                        className="obras-textarea"
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
                        <button type="submit" className="botao-primario">{edicaoId ? "Salvar alterações" : "Cadastrar obra"}</button>
                        <button type="button" className="botao-secundario" onClick={fecharModal}>Cancelar</button>
                    </div>
                </form>
            </Modal>

            {obras.length === 0 ? (
                <p className="lista-vazia">Nenhuma obra cadastrada ainda.</p>
            ) : (
                <div className="obras-grid">
                    {obras.map(obra => (
                        <div key={obra.id} className="obra-card-novo" onClick={() => navigate(`/obras/${obra.id}`)}>
                            <div className="obra-card-imagem">
                                {obra.imagemUrl
                                    ? <img src={`http://localhost:8080${obra.imagemUrl}`} alt={obra.nome} />
                                    : <div className="obra-card-sem-imagem">📷</div>
                                }
                            </div>
                            <div className="obra-card-rodape">
                                <span className="obra-card-nome">{obra.nome}</span>
                                <div className="obra-card-acoes">
                                    <button onClick={(e) => abrirModalEdicao(obra, e)} className="botao-editar">Editar</button>
                                    <button onClick={(e) => handleDelete(obra.id!, e)} className="botao-excluir">Excluir</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Obras