import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Drawer from "./components/drawer/drawer"
import Login from "./pages/login/login"
import Inicio from "./pages/inicio/inicio"
import Dashboard from "./pages/dashboard/dashboard"
import Obras from "./pages/obras/obras"
import Usuarios from "./pages/usuarios/usuarios"
import ObraDetalhe from "./pages/obraDetalhes/obraDetalhes"
import Templates from "./pages/templates/templates"
import Notificacoes from "./pages/notificacoes/notificacoes"
import "./App.css"
import { removerToken } from "./services/auth"

interface LayoutProps {
    nomeUsuario: string
}

function Layout({ nomeUsuario }: LayoutProps)
{
    const [colapsado, setColapsado] = useState(() => localStorage.getItem("drawerColapsado") === "true")

    function handleSair()
    {
        removerToken()
        window.location.href = "/login"
    }

    function alternarDrawer()
    {
        setColapsado(anterior =>
        {
            const novoValor = !anterior
            localStorage.setItem("drawerColapsado", String(novoValor))
            return novoValor
        })
    }

    return (
        <div className="app-container">
            <Drawer
                onSair={handleSair}
                nomeUsuario={nomeUsuario}
                colapsado={colapsado}
                aoAlternar={alternarDrawer}
            />
            <main className={`app-conteudo ${colapsado ? "app-conteudo-colapsado" : ""}`}>
                <Routes>
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/obras" element={<Obras />} />
                    <Route path="/obras/:id" element={<ObraDetalhe />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/templates" element={<Templates />} />
                    <Route path="/notificacoes" element={<Notificacoes />} />
                    <Route path="*" element={<Navigate replace to="/inicio" />} />
                </Routes>
            </main>
        </div>
    )
}

function App()
{
    const [logado, setLogado] = useState(false)
    const [nomeUsuario, setNomeUsuario] = useState("")

    function handleLogin(nome: string)
    {
        setNomeUsuario(nome)
        setLogado(true)
    }

    if (!logado)
    {
        return (
            <BrowserRouter>
                <Login onLogin={handleLogin} />
            </BrowserRouter>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={logado ? <Navigate to="/inicio" /> : <Login onLogin={handleLogin} />}
                />
                <Route
                    path="/*"
                    element={logado ? <Layout nomeUsuario={nomeUsuario} /> : <Navigate to="/login" />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
