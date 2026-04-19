import { useEffect, useState } from "react"
import { api } from "./services/api"
import type { Obra } from "./types/obras"
import "./App.css"


function App()
{
    const [obras, setObras] = useState<Obra[]>([])
    const [edicaoId, setEdicaoId] = useState<number | null>(null)
    const [form, setForm] = useState<Obra>(
    {
        nome: "",
        endereco: "",
        clienteResponsavel: "",
        status: "",
        descricao: ""
    })

    async function carregarObras()
    {
        const respostaApi = await api.get("/obras")
        setObras(respostaApi.data)
    }

    useEffect(() =>
    {
        carregarObras()
    }, [])

    async function handleSubmit(e: React.FormEvent)
    {
        e.preventDefault()

        if (edicaoId)
        {
            await api.put(`/obras/${edicaoId}`, form)
            setEdicaoId(null)
        }
        else
        {
            await api.post("/obras", form)
        }

        setForm(
        {
            nome: "",
            endereco: "",
            clienteResponsavel: "",
            status: "",
            descricao: ""
        })

        carregarObras()
    }

    async function handleDelete(id: number)
    {
        await api.delete(`/obras/${id}`)
        carregarObras()
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

            <h1 className="titulo">Gerenciamento de Obras</h1>

            <div className="card">
                <h2 className="card-titulo">
                    {edicaoId ? `Editar ${form.nome}` : "Nova obra"}
                </h2>

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
                        className="textarea"
                    />

                    <div className="botoes">
                        <button type="submit" className="botao-primario">
                            {edicaoId ? "Salvar alterações" : "Cadastrar obra"}
                        </button>

                        {edicaoId && (
                            <button
                                type="button"
                                className="botao-secundario"
                                onClick={() =>
                                {
                                    setEdicaoId(null)
                                    setForm({ nome: "", endereco: "", clienteResponsavel: "", status: "", descricao: "" })
                                }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

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
                                <span className={getBadgeClass(obra.status)}>
                                    {obra.status}
                                </span>

                                <button
                                    onClick={() => handleEdit(obra)}
                                    className="botao-editar"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => handleDelete(obra.id!)}
                                    className="botao-excluir"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default App