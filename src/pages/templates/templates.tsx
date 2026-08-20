import { useEffect, useState } from "react"
import { api } from "../../services/api"
import type { Template } from "../../types/templates"
import Modal from "../../components/modal/modal"
import { Pencil, Trash2 } from "lucide-react"
import "./Templates.css"

const formVazio: Template = { titulo: "", tipo: "", corpo: "" }

function Templates()
{
    const [templates, setTemplates] = useState<Template[]>([])
    const [modalAberto, setModalAberto] = useState(false)
    const [edicaoId, setEdicaoId] = useState<number | null>(null)
    const [form, setForm] = useState<Template>(formVazio)

    async function carregarTemplates()
    {
        const respostaApi = await api.get("/templates")
        setTemplates(respostaApi.data)
    }

    useEffect(() => { carregarTemplates() }, [])

    function abrirModalNovo()
    {
        setForm(formVazio)
        setEdicaoId(null)
        setModalAberto(true)
    }

    function abrirModalEdicao(template: Template)
    {
        setForm(template)
        setEdicaoId(template.id!)
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
                await api.put(`/templates/${edicaoId}`, form)
            }
            else
            {
                await api.post("/templates", form)
            }
            fecharModal()
            carregarTemplates()
        }
        catch
        {
            alert("Erro ao salvar template. Verifique os dados e tente novamente.")
        }
    }

    async function handleDelete(id: number)
    {
        if (!confirm("Deseja excluir este template?")) return
        try
        {
            await api.delete(`/templates/${id}`)
            carregarTemplates()
        }
        catch
        {
            alert("Erro ao excluir template.")
        }
    }

    function getBadgeClass(tipo: string)
    {
        if (tipo === "Email") return "badge-email"
        return "badge-whatsapp"
    }

    return (
        <div className="pagina">
            <div className="pagina-header">
                <h1 className="titulo">Gerenciamento de Templates</h1>
                <button className="botao-primario" onClick={abrirModalNovo}>+ Novo template</button>
            </div>

            <Modal
                aberto={modalAberto}
                titulo={edicaoId ? "Editar template" : "Novo template"}
                onFechar={fecharModal}
            >
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-grid">
                        <input
                            placeholder="Título"
                            value={form.titulo}
                            onChange={e => setForm({ ...form, titulo: e.target.value })}
                            required
                            className="input"
                        />
                        <select
                            value={form.tipo}
                            onChange={e => setForm({ ...form, tipo: e.target.value })}
                            required
                            className="input"
                        >
                            <option value="" disabled>Selecionar tipo</option>
                            <option value="Email">Email</option>
                            <option value="WhatsApp">WhatsApp</option>
                        </select>
                    </div>

                    <textarea
                        placeholder="Corpo da mensagem — use {variavel} para campos dinâmicos"
                        value={form.corpo}
                        onChange={e => setForm({ ...form, corpo: e.target.value })}
                        rows={6}
                        style={{ backgroundColor: "#212529", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", color: "white", width: "100%", resize: "none", outline: "none" }}
                    />

                    {form.corpo && (
                        <p className="templates-dica">
                            Ex: "Olá {"{nome_cliente}"}, sua obra em {"{endereco}"} está {"{status}"}."
                        </p>
                    )}

                    <div className="botoes">
                        <button type="submit" className="botao-primario">{edicaoId ? "Salvar alterações" : "Cadastrar template"}</button>
                        <button type="button" className="botao-secundario" onClick={fecharModal}>Cancelar</button>
                    </div>
                </form>
            </Modal>

            <h2 className="lista-titulo">Templates cadastrados</h2>

            {templates.length === 0 ? (
                <p className="lista-vazia">Nenhum template cadastrado ainda.</p>
            ) : (
                <div className="lista">
                    {templates.map(template => (
                        <div key={template.id} className="obra-card">
                            <div className="obra-info">
                                <span className="obra-nome">{template.titulo}</span>
                                <span className="obra-detalhe">{template.corpo}</span>
                                {template.variaveis && (
                                    <span className="obra-descricao">Variáveis: {template.variaveis}</span>
                                )}
                            </div>
                            <div className="obra-acoes">
                                <span className={getBadgeClass(template.tipo)}>{template.tipo}</span>
                                <button onClick={() => abrirModalEdicao(template)} className="botao-editar"><Pencil size={15} /></button>
                                <button onClick={() => handleDelete(template.id!)} className="botao-excluir"><Trash2 size={15} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Templates