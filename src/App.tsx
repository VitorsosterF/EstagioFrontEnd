import { useEffect, useState} from "react"
import { api } from "./services/api"
import type { Obra } from "./types/obras"

function App() {
  const [obras, setObras] = useState<Obra[]>([])
  const [edicaoId, setEdicaoId] = useState<number | null>(null)
  const [form, setForm] = useState<Obra>
  ({
    nome: "",
    endereco: "",
    cliente: "",
    status: "",
    dataCriacao: ""
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

  async function handleSubmit(e: React.SubmitEvent) 
  {
    e.preventDefault()

    if(edicaoId) 
    {
      await api.put(`/obras/${edicaoId}`, form)
      setEdicaoId(null)
    }
    else
    {
      await api.post("/obras", form)
    }
    
    setForm
    ({
      nome: "",
      endereco: "",
      cliente: "",
      status: "",
      dataCriacao: ""
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

  return (
    <div style={{ padding: 20 }}>
      <h1>CRUD de Obras</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
        />

        <input
          placeholder="Endereço"
          value={form.endereco}
          onChange={e => setForm({ ...form, endereco: e.target.value })}
        />

        <input
          placeholder="Cliente"
          value={form.cliente}
          onChange={e => setForm({ ...form, cliente: e.target.value })}
        />

        <input
          placeholder="Status"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        />

        <input
          type="date"
          value={form.dataCriacao}
          onChange={e => setForm({ ...form, dataCriacao: e.target.value })}
        />

        <button type="submit">
          {edicaoId ? "Atualizar" : "Cadastrar"}
        </button>
      </form>

      <hr />

      <ul>
        {obras.map(obra => (
          <li key={obra.id}>
            <strong>{obra.nome}</strong> | {obra.cliente} | {obra.status}
            <br />
            {obra.endereco} | {obra.dataCriacao}

            <br />
            <button onClick={() => handleEdit(obra)}>Editar</button>
            <button onClick={() => handleDelete(obra.id!)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App