import { useState, useEffect } from 'react'

function Servicos({ setMensagem, setTipoMensagem }) {

    const [servicos, setServicos] = useState([])
    const [nomeServico, setNomeServico] = useState('')
    const [preco, setPreco] = useState('')
    const [servicoEditando, setServicoEditando] = useState(null)

    async function buscarServicos() {
        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/servicos`)
            const dados = await resposta.json()
            setServicos(dados)
        } catch (erro) {
            console.error('Erro ao buscar serviços:', erro)
            setMensagem('Não foi possível conectar ao servidor. Tente novamente em alguns segundos.')
            setTipoMensagem('erro')
        }
    }

    async function cadastrarServico(e) {
        e.preventDefault()
        try {
            let url = `${import.meta.env.VITE_API_URL}/servicos`
            let metodo = 'POST'
            if (servicoEditando) {
                url = `${import.meta.env.VITE_API_URL}/servicos/${servicoEditando.id}`
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
        } catch (erro) {
            console.error('Erro ao cadastrar/editar serviço:', erro)
            setMensagem('Não foi possível conectar ao servidor. Tente novamente em alguns segundos.')
            setTipoMensagem('erro')
        }
    }

    async function removerServico(id) {
        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/servicos/${id}`, { method: 'DELETE' })
            const dados = await resposta.json()
            if (dados.erro) {
                setMensagem(dados.erro)
                setTipoMensagem('erro')
            } else {
                buscarServicos()
                setMensagem('Serviço removido com sucesso!')
                setTipoMensagem('sucesso')
            }
        } catch (erro) {
            console.error('Erro ao remover serviço:', erro)
            setMensagem('Não foi possível conectar ao servidor. Tente novamente em alguns segundos.')
            setTipoMensagem('erro')
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