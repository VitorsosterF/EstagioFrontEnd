import { useEffect, useState } from "react"
import { api } from "../../services/api"
import type { Usuario } from "../../types/usuarios"
import "./Usuarios.css"

function Usuarios()
{
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [edicaoId, setEdicaoId] = useState<number | null>(null)
    const [form, setForm] = useState<Usuario>(
    {
        nome: "",
        sobrenome: "",
        email: "",
        senha: "",
        perfil: ""
    })

    async function carregarUsuarios()
    {
        const respostaApi = await api.get("/usuarios")
        setUsuarios(respostaApi.data)
    }

    useEffect(() =>
    {
        carregarUsuarios()
    }, [])

    async function handleSubmit(e: React.FormEvent)
    {
        e.preventDefault()

        if (edicaoId)
        {
            await api.put(`/usuarios/${edicaoId}`, form)
            setEdicaoId(null)
        }
        else
        {
            await api.post("/usuarios", form)
        }

        setForm(
        {
            nome: "",
            sobrenome: "",
            email: "",
            senha: "",
            perfil: ""
        })

        carregarUsuarios()
    }

    async function handleDelete(id: number)
    {
        await api.delete(`/usuarios/${id}`)
        carregarUsuarios()
    }

    async function handleEdit(usuario: Usuario)
    {
        setForm(usuario)
        setEdicaoId(usuario.id!)
    }

    function getBadgeClass(perfil: string)
    {
        if (perfil === "Admin") return "badge-admin"
        if (perfil === "Gestor") return "badge-gestor"
        return "badge-cliente"
    }

    return (
        <div className="pagina">

            <h1 className="titulo">Gerenciamento de Usuários</h1>

            <div className="card">
                <h2 className="card-titulo">
                    {edicaoId ? "Editar usuário" : "Novo usuário"}
                </h2>

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-grid">
                        <input
                            placeholder="Nome"
                            value={form.nome}
                            onChange={e => setForm({ ...form, nome: e.target.value })}
                            required
                            className="input"
                        />

                        <input
                            placeholder="Sobrenome"
                            value={form.sobrenome}
                            onChange={e => setForm({ ...form, sobrenome: e.target.value })}
                            required
                            className="input"
                        />

                        <input
                            type="email"
                            placeholder="E-mail"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                            className="input"
                        />

                        <input
                            type="password"
                            placeholder="Senha provisória"
                            value={form.senha}
                            onChange={e => setForm({ ...form, senha: e.target.value })}
                            required
                            className="input"
                        />

                        <select
                            value={form.perfil}
                            onChange={e => setForm({ ...form, perfil: e.target.value })}
                            required
                            className="input"
                        >
                            <option value="" disabled>Selecionar perfil</option>
                            <option value="Admin">Admin</option>
                            <option value="Gestor">Gestor</option>
                            <option value="Cliente">Cliente</option>
                        </select>
                    </div>

                    <div className="botoes">
                        <button type="submit" className="botao-primario">
                            {edicaoId ? "Salvar alterações" : "Salvar usuário"}
                        </button>

                        {edicaoId && (
                            <button
                                type="button"
                                className="botao-secundario"
                                onClick={() =>
                                {
                                    setEdicaoId(null)
                                    setForm({ nome: "", sobrenome: "", email: "", senha: "", perfil: "" })
                                }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h2 className="lista-titulo">Usuários cadastrados</h2>

            {usuarios.length === 0 ? (
                <p className="lista-vazia">Nenhum usuário cadastrado ainda.</p>
            ) : (
                <div className="lista">
                    {usuarios.map(usuario => (
                        <div key={usuario.id} className="obra-card">
                            <div className="obra-info">
                                <span className="obra-nome">{usuario.nome} {usuario.sobrenome}</span>
                                <span className="obra-detalhe">{usuario.email}</span>
                            </div>

                            <div className="obra-acoes">
                                <span className={getBadgeClass(usuario.perfil)}>
                                    {usuario.perfil}
                                </span>

                                <button
                                    onClick={() => handleEdit(usuario)}
                                    className="botao-editar"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => handleDelete(usuario.id!)}
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

export default Usuarios