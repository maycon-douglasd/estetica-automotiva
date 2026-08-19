import { useState, useEffect } from 'react'

function UsoServicos() {

    const [usoServicos, setUsoServicos] = useState([])
    const [veiculos, setVeiculos] = useState([])

    async function buscarUsoServicos() {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/uso-servicos`)
        const dados = await resposta.json()
        setUsoServicos(dados)
    }

    async function buscarVeiculos() {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/veiculos`)
        const dados = await resposta.json()
        setVeiculos(dados)
    }

    useEffect(() => {
        buscarUsoServicos()
        buscarVeiculos()
    }, [])


    return (
        <div>
            <h2>Uso de serviços por veículo</h2>

            <div className="grid">
                {usoServicos.map((item, index) => (

                    <div key={index} className="card">

                        <p>{veiculos.find((veiculo) => veiculo.id === item.veiculo_id)?.placa || 'Veículo não encontrado'} — {veiculos.find((veiculo) => veiculo.id === item.veiculo_id)?.modelo}</p>

                        <p>{item.total_servicos} serviço(s)</p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default UsoServicos