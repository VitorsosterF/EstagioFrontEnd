// Validações de formulário compartilhadas entre as telas. Centralizam a regra
// de "campo de texto não pode ser só número", já que nome/rua/etc. são varchar
// livres no back (que só checa isBlank).

// Considera válido um texto que tenha ao menos uma letra (acentos inclusos),
// evitando que "123" passe como nome de pessoa ou logradouro.
export function contemLetra(valor: string): boolean
{
    return /\p{L}/u.test(valor)
}

// Valida o formato de e-mail no cliente (o login não usa <form>, então o
// type="email" nativo não dispara — a checagem precisa ser feita na mão).
export function emailValido(valor: string): boolean
{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
}

// Devolve a primeira mensagem de erro encontrada nos campos informados, ou null
// se todos tiverem ao menos uma letra. `campos` mapeia rótulo -> valor.
export function validarCamposTexto(campos: Record<string, string>): string | null
{
    for (const [rotulo, valor] of Object.entries(campos))
    {
        if (!contemLetra(valor))
        {
            return `O campo "${rotulo}" deve conter letras, não apenas números.`
        }
    }
    return null
}
