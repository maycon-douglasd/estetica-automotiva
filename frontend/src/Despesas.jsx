import { useState, useEffect } from 'react'

function Despesas({ setMensagem, setTipoMensagem }) {

    const [despesas, setDespesas] = useState([])
    const [descricao, setDescricao] = useState('')
    const [categoria, setCategoria] = useState('')
    const [valor, setValor] = useState('')

    async function buscarDespesas() {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/despesas`)
        const dados = await resposta.json()
        setDespesas(dados)
    }

    async function cadastrarDespesa(e) {
        e.preventDefault()
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/despesas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                descricao: descricao,
                categoria: categoria,
                valor: valor
            })
        })
        const dados = await resposta.json()
        if (dados.erro) {
            setMensagem(dados.erro)
            setTipoMensagem('erro')
        } else {
            buscarDespesas()
            setMensagem('Despesa cadastrada com sucesso!')
            setTipoMensagem('sucesso')
            setDescricao('')
            setCategoria('')
            setValor('')
        }
    }

    async function removerDespesa(id) {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/despesas/${id}`, { method: 'DELETE' })
        const dados = await resposta.json()
        if (dados.erro) {
            setMensagem(dados.erro)
            setTipoMensagem('erro')
        } else {
            buscarDespesas()
            setMensagem('Despesa removida com sucesso!')
            setTipoMensagem('sucesso')
        }
    }

    useEffect(() => {
        buscarDespesas()
    }, [])

    return (
        <div>
            <form onSubmit={cadastrarDespesa}>
                <input
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descrição da despesa"
                    required
                />

                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                    <option value="">Selecione a categoria</option>

                    <option value="produtos">Produtos/Mercadorias</option>

                    <option value="funcionarios">Funcionários/Salários</option>

                    <option value="outros">Outros</option>
                </select>

                <input
                    type="number"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="Valor"
                    required
                />

                <button type="submit">Cadastrar</button>
            </form>

            <div className="grid">
                {despesas.map((despesa) => (
                    <div key={despesa.id} className="card">

                        <p>{despesa.descricao}</p>

                        <p>{despesa.categoria}</p>

                        <p>R$ {despesa.valor}</p>
                        
                        <div className="acoes">
                            <button className="btn-remover" onClick={() => removerDespesa(despesa.id)}>
                                Remover
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Despesas