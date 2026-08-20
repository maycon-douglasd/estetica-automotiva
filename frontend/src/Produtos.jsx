import { useState, useEffect } from 'react'
import FormMovimentacao from './FormMovimentacao'

function Produtos({ setMensagem, setTipoMensagem }) {

    const [produtos, setProdutos] = useState([])
    const [nome, setNome] = useState('')
    const [tipo, setTipo] = useState('')
    const [quantidadeAtual, setQuantidadeAtual] = useState('')
    const [estoqueMinimo, setEstoqueMinimo] = useState('')

    async function buscarProdutos() {
        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/produtos`)
            const dados = await resposta.json()
            setProdutos(dados)
        } catch (erro) {
            console.error('Erro ao buscar produtos:', erro)
            setMensagem('Não foi possível conectar ao servidor. Tente novamente em alguns segundos.')
            setTipoMensagem('erro')
        }
    }

    async function cadastrarProduto(e) {
        e.preventDefault()
        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/produtos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: nome,
                    tipo: tipo,
                    quantidade_atual: quantidadeAtual,
                    estoque_minimo: estoqueMinimo,
                    fornecedor_id: null
                })
            })
            const dados = await resposta.json()
            if (dados.erro) {
                setMensagem(dados.erro)
                setTipoMensagem('erro')
            } else {
                buscarProdutos()
                setMensagem('Produto cadastrado com sucesso!')
                setTipoMensagem('sucesso')
                setNome('')
                setTipo('')
                setQuantidadeAtual('')
                setEstoqueMinimo('')
            }
        } catch (erro) {
            console.error('Erro ao cadastrar produto:', erro)
            setMensagem('Não foi possível conectar ao servidor. Tente novamente em alguns segundos.')
            setTipoMensagem('erro')
        }
    }

    async function removerProduto(id) {
        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/produtos/${id}`, { method: 'DELETE' })
            const dados = await resposta.json()
            if (dados.erro) {
                setMensagem(dados.erro)
                setTipoMensagem('erro')
            } else {
                buscarProdutos()
                setMensagem('Produto removido com sucesso!')
                setTipoMensagem('sucesso')
            }
        } catch (erro) {
            console.error('Erro ao remover produto:', erro)
            setMensagem('Não foi possível conectar ao servidor. Tente novamente em alguns segundos.')
            setTipoMensagem('erro')
        }
    }

    async function registrarMovimentacao(produtoId, tipo, quantidade) {
        try {
            const resposta = await fetch(`${import.meta.env.VITE_API_URL}/movimentacoes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    produto_id: produtoId,
                    tipo: tipo,
                    quantidade: quantidade
                })
            })
            const dados = await resposta.json()
            if (dados.erro) {
                setMensagem(dados.erro)
                setTipoMensagem('erro')
                return false
            } else {
                buscarProdutos()
                setMensagem('Movimentação registrada com sucesso!')
                setTipoMensagem('sucesso')
                return true
            }
        } catch (erro) {
            console.error('Erro ao registrar movimentação:', erro)
            setMensagem('Não foi possível conectar ao servidor. Tente novamente em alguns segundos.')
            setTipoMensagem('erro')
            return false
        }
    }

    useEffect(() => {
        buscarProdutos()
    }, [])

    return (
        <div className="secao">
            <form onSubmit={cadastrarProduto}>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do produto"
                    required
                />
                <input
                    type="text"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    placeholder="Tipo do produto"
                    required
                />
                <input
                    type="number"
                    value={quantidadeAtual}
                    onChange={(e) => setQuantidadeAtual(e.target.value)}
                    placeholder="Quantidade atual dos produtos"
                    required
                />
                <input
                    type="number"
                    value={estoqueMinimo}
                    onChange={(e) => setEstoqueMinimo(e.target.value)}
                    placeholder="Quantidade mínima do estoque"
                    required
                />

                <button type="submit">Cadastrar</button>
            </form>

            <div className="grid">
                {produtos.map((produto) => (

                    <div key={produto.id} className="card">

                        <p>{produto.nome}</p>

                        <p>{produto.tipo}</p>

                        <p>{produto.quantidade_atual}</p>
                        {produto.quantidade_atual <= produto.estoque_minimo && <p className="alerta">⚠️ Estoque baixo!</p>}

                        <FormMovimentacao produtoId={produto.id} registrarMovimentacao={registrarMovimentacao} />

                        <button className="btn-remover" onClick={() => removerProduto(produto.id)}>
                            Remover
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Produtos