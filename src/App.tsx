import { useState } from "react"
import Drawer from "./components/drawer/drawer"
import Login from "./pages/login/login"
import Obras from "./pages/obras/obras"
import Usuarios from "./pages/usuarios/usuarios"
import "./App.css"

function App()
{
    const [logado, setLogado] = useState(false)
    const [paginaAtiva, setPaginaAtiva] = useState("obras")

    function handleLogin()
    {
        setLogado(true)
    }

    function handleSair()
    {
        setLogado(false)
        setPaginaAtiva("obras")
    }

    if (!logado)
    {
        return <Login onLogin={handleLogin} />
    }

    return (
        <div className="app-container">
            <Drawer
                paginaAtiva={paginaAtiva}
                setPaginaAtiva={setPaginaAtiva}
                onSair={handleSair}
            />

            <main className="app-conteudo">
                {paginaAtiva === "obras" && <Obras />}
                {paginaAtiva === "usuarios" && <div>Página de usuários em breve</div>}
            </main>
        </div>
    )
}

export default App