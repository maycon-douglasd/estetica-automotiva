import { useState, useEffect } from 'react'

function Servicos({ setMensagem, setTipoMensagem }) {

    const [servicos, setServicos] = useState([])
    const [nomeServico, setNomeServico] = useState('')
    const [preco, setPreco] = useState('')
    const [servicoEditando, setServicoEditando] = useState(null)

    async function buscarServicos() {
        const resposta = await fetch('http://localhost:3000/servicos')
        const dados = await resposta.json()
        setServicos(dados)
    }

    async function cadastrarServico(e) {
        e.preventDefault()
        let url = 'http://localhost:3000/servicos'
        let metodo = 'POST'
        if (servicoEditando) {
            url = `http://localhost:3000/servicos/${servicoEditando.id}`
            metodo = 'PUT'
        }
        const resposta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: nomeServico,
                preco: preco
            })
        })
        const dados = await resposta.json()
        if (dados.erro) {
            setMensagem(dados.erro)
            setTipoMensagem('erro')
        } else {
            buscarServicos()
            setMensagem('Serviço salvo com sucesso!')
            setTipoMensagem('sucesso')
            setNomeServico('')
            setPreco('')
            setServicoEditando(null)
        }
    }

    async function removerServico(id) {
        const resposta = await fetch(`http://localhost:3000/servicos/${id}`, { method: 'DELETE' })
        const dados = await resposta.json()
        if (dados.erro) {
            setMensagem(dados.erro)
            setTipoMensagem('erro')
        } else {
            buscarServicos()
            setMensagem('Serviço removido com sucesso!')
            setTipoMensagem('sucesso')
        }
    }

    function iniciarEdicaoServico(servico) {
        setNomeServico(servico.nome)
        setPreco(servico.preco)
        setServicoEditando(servico)
    }

    useEffect(() => {
        buscarServicos()
    }, [])

    return (
        <div className="secao">
            <form onSubmit={cadastrarServico}>
                <input
                    type="text"
                    value={nomeServico}
                    onChange={(e) => setNomeServico(e.target.value)}
                    placeholder="Nome do serviço"
                    required
                />
                <input
                    type="number"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    placeholder="Valor do serviço"
                    required
                />

                <button type="submit">Cadastrar</button>
            </form>

            <div className="grid">
                {servicos.map((servico) => (

                    <div key={servico.id} className="card">

                        <p>{servico.nome}</p>

                        <p>{servico.preco}</p>

                        <div className="acoes">
                            <button onClick={() => iniciarEdicaoServico(servico)}>Editar</button>

                            <button className="btn-remover" onClick={() => removerServico(servico.id)}>
                                Remover
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Servicos