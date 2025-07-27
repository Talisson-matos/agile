import React, { useState } from 'react'
import './Formatador.css'

const Formatador = () => {
  const [entrada, setEntrada] = useState('')
  const [limpo, setLimpo] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [mostrarNotas, setMostrarNotas] = useState(false)
  const [mostrarCnpj, setMostrarCnpj] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const original = e.target.value
    const somenteNumeros = original.replace(/[^\d]/g, '')
    setEntrada(original)
    setLimpo(somenteNumeros)
    setCopiado(false)
  }

  const copiar = () => {
    navigator.clipboard.writeText(limpo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1500)
  }

  const limpar = () => {
    setEntrada('')
    setLimpo('')
    setCopiado(false)
  }

  const abrirLink = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="formatador-container">
      <h2>🔎 Formatador de Chaves e CNPJ</h2>

      <textarea       
        value={entrada}
        onChange={handleChange}
        className="formatador-textarea"
        style={{resize:'none'}}
      />

      {limpo && (
        <>
          <div className="formatador-resultado">
            <strong>🔢 Resultado:</strong>
            <p>{limpo}</p>
          </div>

          <div className="formatador-botoes">
            <button onClick={copiar} className="formatador-botao">📋 Copiar</button>
            <button onClick={limpar} className="formatador-botao limpar">🧹 Limpar</button>
          </div>

          {copiado && <span className="formatador-feedback">✅ Copiado!</span>}
        </>
      )}

      <h3>🔗 Links úteis</h3>

      <div className="formatador-links">
        <button
          className="dropdown-toggle"
          onClick={() => setMostrarNotas(!mostrarNotas)}
        >
          📑 Notas Fiscais / CTe
        </button>
        {mostrarNotas && (
          <div className="link-buttons">
            <button onClick={() => abrirLink('https://consultadanfe.com/')}>Consulta DANFE</button>
            <button onClick={() => abrirLink('https://www.meudanfe.com.br/')}>Meu DANFE</button>
            <button onClick={() => abrirLink('https://www.danfeonline.com.br/')}>DANFE Online</button>
            <button onClick={() => abrirLink('https://danferapida.com.br/')}>DANFE Rápida</button>
            <button onClick={() => abrirLink('https://www.fsist.com.br/')}>FSist</button>
            <button onClick={() => abrirLink('https://www.cte.fazenda.gov.br/portal/')}>Portal CTe</button>
          </div>
        )}

        <button
          className="dropdown-toggle"
          onClick={() => setMostrarCnpj(!mostrarCnpj)}
        >
          🧾 CNPJ
        </button>
        {mostrarCnpj && (
          <div className="link-buttons">
            <button onClick={() => abrirLink('https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/cnpjreva_Solicitacao.asp')}>Receita Federal</button>
            <button onClick={() => abrirLink('https://cnpja.com/')}>CNPJá</button>
            <button onClick={() => abrirLink('https://consultacnpj.com/')}>Consulta CNPJ</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Formatador
