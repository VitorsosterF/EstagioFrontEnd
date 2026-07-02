import { useEffect, useState } from "react"
import { api } from "../../services/api"
import type { Obra } from "../../types/obras"
import Modal from "../../components/modal/modal"
import "./Obras.css"

const formVazio: Obra = { nome: "", endereco: "", clienteResponsavel: "", status: "", descricao: "" }

function Obras()
{
    const [obras, setObras] = useState<Obra[]>([])
    const [edicaoId, setEdicaoId] = useState<number | null>(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [form, setForm] = useState<Obra>(formVazio)

    async function carregarObras()
    {
        const respostaApi = await api.get("/obras")
        setObras(respostaApi.data)
    }

    useEffect(() =>
    {
        carregarObras()
    }, [])

    function abrirModalCriacao()
    {
        setForm(formVazio)
        setEdicaoId(null)
        setModalAberto(true)
    }

    function abrirModalEdicao(obra: Obra)
    {
        setForm(obra)
        setEdicaoId(obra.id!)
        setModalAberto(true)
    }
    function fecharModal()
    {
        setModalAberto(false)
        setEdicaoId(null)
        setForm(formVazio)
    }


    async function handleSubmit(e: React.FormEvent) 
    {
        e.preventDefault()
        try 
        {
            if (edicaoId) 
                {
                await api.put(`/obras/${edicaoId}`, form)
                setEdicaoId(null)
            } else 
            {
                await api.post("/obras", form)
            }

            fecharModal()
            carregarObras()
        } catch (error) 
        {
            alert("Erro ao salvar obra. Verifique os dados e tente novamente.")
        }
    }

    async function handleDelete(id: number) 
    {
        if (!confirm("Deseja excluir esta obra?")) return
        try 
        {
            await api.delete(`/obras/${id}`)
            carregarObras()
        } catch (error) 
        {
            alert("Erro ao excluir obra.")
        }
    }

    async function handleEdit(obra: Obra)
    {
        setForm(obra)
        setEdicaoId(obra.id!)
    }

    function getBadgeClass(status: string)
    {
        if (status === "Em andamento") return "badge-andamento"
        if (status === "Concluída") return "badge-concluida"
        return "badge-pausada"
    }

    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="titulo">Gerenciamento de Obras</h1>
                <button className="botao-primario" onClick={abrirModalCriacao}>
                    + Nova obra
                </button>
            </div>

            <Modal
                aberto={modalAberto}
                titulo={edicaoId ? "Editar obra" : "Nova obra"}
                onFechar={fecharModal}
            >
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-grid">
                        <input
                            placeholder="Nome da obra"
                            value={form.nome}
                            onChange={e => setForm({ ...form, nome: e.target.value })}
                            required
                            className="input"
                        />
                        <input
                            placeholder="Endereço"
                            value={form.endereco}
                            onChange={e => setForm({ ...form, endereco: e.target.value })}
                            required
                            className="input"
                        />
                        <input
                            placeholder="Cliente responsável"
                            value={form.clienteResponsavel}
                            onChange={e => setForm({ ...form, clienteResponsavel: e.target.value })}
                            required
                            className="input"
                        />
                        <select
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}
                            required
                            className="input"
                        >
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
                        style={{
                            backgroundColor: "#212529",
                            border: "0.5px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            padding: "10px 12px",
                            fontSize: "14px",
                            color: "white",
                            width: "100%",
                            resize: "none",
                            outline: "none",
                        }}
                    />
                    <div className="botoes">
                        <button type="submit" className="botao-primario">
                            {edicaoId ? "Salvar alterações" : "Cadastrar obra"}
                        </button>
                        <button type="button" className="botao-secundario" onClick={fecharModal}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>

            <h2 className="lista-titulo">Obras cadastradas</h2>

            {obras.length === 0 ? (
                <p className="lista-vazia">Nenhuma obra cadastrada ainda.</p>
            ) : (
                <div className="lista">
                    {obras.map(obra => (
                        <div key={obra.id} className="obra-card">
                            <div className="obra-info">
                                <span className="obra-nome">{obra.nome}</span>
                                <span className="obra-detalhe">{obra.endereco}</span>
                                <span className="obra-detalhe">{obra.clienteResponsavel}</span>
                                {obra.descricao && (
                                    <span className="obra-descricao">{obra.descricao}</span>
                                )}
                            </div>
                            <div className="obra-acoes">
                                <span className={getBadgeClass(obra.status)}>{obra.status}</span>
                                <button onClick={() => abrirModalEdicao(obra)} className="botao-editar">Editar</button>
                                <button onClick={() => handleDelete(obra.id!)} className="botao-excluir">Excluir</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Obras