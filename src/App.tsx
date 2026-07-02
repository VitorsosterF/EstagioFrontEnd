import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Drawer from "./components/drawer/drawer"
import Login from "./pages/login/login"
import Obras from "./pages/obras/obras"
import Usuarios from "./pages/usuarios/usuarios"
import ObraDetalhe from "./pages/obraDetalhes/obraDetalhes"
import "./App.css"

function Layout()
{
    const [paginaAtiva, setPaginaAtiva] = useState("obras")

    function handleSair()
    {
        window.location.href = "/login"
    }

    return (
        <div className="app-container">
            <Drawer
                paginaAtiva={paginaAtiva}
                setPaginaAtiva={setPaginaAtiva}
                onSair={handleSair}
            />
            <main className="app-conteudo">
                <Routes>
                    <Route path="/obras" element={<Obras />} />
                    <Route path="/obras/:id" element={<ObraDetalhe />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="*" element={<Navigate replace to="/obras" />} />
                </Routes>
            </main>
        </div>
    )
}

function App()
{
    const [logado, setLogado] = useState(false)

    function handleLogin()
    {
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
                    element={logado ? <Navigate to="/obras" /> : <Login onLogin={handleLogin} />}
                />
                <Route
                    path="/*"
                    element={logado ? <Layout /> : <Navigate to="/login" />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App