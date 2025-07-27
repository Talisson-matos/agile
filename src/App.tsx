import { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css'

function App() {
  // Estados principais
  const [frete, setFrete] = useState<string>('')
  const [taxa, setTaxa] = useState<string>('')
  const [resultado, setResultado] = useState<{
    valorICMS: number
    creditoPresumido: number
    icmsRecolher: number
  } | null>(null)

  // Modais
  const [showGuiaModal, setShowGuiaModal] = useState(false)
  const [showCteModal, setShowCteModal] = useState(false)

  // Estado Obs. Guia
  const [guiaNumero, setGuiaNumero] = useState('')
  const [guiaSerie, setGuiaSerie] = useState('')
  const [guiaMotorista, setGuiaMotorista] = useState('')
  const [guiaLinha, setGuiaLinha] = useState('')
  const [guiaSubmitted, setGuiaSubmitted] = useState(false)
  const [guiaCopied, setGuiaCopied] = useState(false)

  // Estado Obs. CTe
  const [obsList, setObsList] = useState<string[]>([])
  const [sinistroAdded, setSinistroAdded] = useState(false)
  const [cteSubmitted, setCteSubmitted] = useState(false)
  const [cteCopied, setCteCopied] = useState(false)

  // Formata número em R$
  const formatarRS = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // Regex que permite só dígitos e até duas casas decimais
  const handleInput =
    (setter: (v: string) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value
        if (/^\d*([.,]?\d{0,2})?$/.test(valor)) {
          setter(valor)
        }
      }

  // Cálculo de ICMS
  const calcularICMS = () => {
    const vFrete = parseFloat(frete.replace(',', '.')) || 0
    const vTaxa = parseFloat(taxa.replace(',', '.')) || 0
    const valorICMS = vFrete * (vTaxa / 100)
    const creditoPresumido = valorICMS * 0.2
    const icmsRecolher = valorICMS * 0.8
    setResultado({ valorICMS, creditoPresumido, icmsRecolher })
  }

  const limparTudo = () => {
    setFrete('')
    setTaxa('')
    setResultado(null)
  }

  // Funções Obs. Guia
  const openGuiaModal = () => {
    setShowGuiaModal(true)
    setGuiaSubmitted(false)
    setGuiaCopied(false)
    setGuiaNumero('')
    setGuiaSerie('')
    setGuiaMotorista('')
    setGuiaLinha('')
  }

  const closeGuiaModal = () => {
    setShowGuiaModal(false)
  }

  const clearGuia = () => {
    setGuiaNumero('')
    setGuiaSerie('')
    setGuiaMotorista('')
    setGuiaLinha('')
    setGuiaSubmitted(false)
    setGuiaCopied(false)
  }

  const copyGuiaToClipboard = () => {
    if (!resultado) return
    const lines = [
      `CTE: ${guiaNumero}`,
      `SERIE: ${guiaSerie}`,
      `MOTORISTA: ${guiaMotorista}`,
      `LINHA: ${guiaLinha}`,
      `VALOR PRESTAÇÃO: ${formatarRS(parseFloat(frete.replace(',', '.')))}`,
      `VALOR ICMS(${taxa}%): ${formatarRS(resultado.valorICMS)}`,
      `CREDITO PRESUMIDO: ${formatarRS(resultado.creditoPresumido)}`,
      `ICMS A RECOLHER: ${formatarRS(resultado.icmsRecolher)}`,
    ].join('\n')
    navigator.clipboard.writeText(lines)
    setGuiaCopied(true)
  }

  // Funções Obs. CTe
  const openCteModal = () => {
    setShowCteModal(true)
    setObsList([])
    setSinistroAdded(false)
    setCteSubmitted(false)
    setCteCopied(false)
  }

  const closeCteModal = () => {
    setShowCteModal(false)
  }

  const addObsInput = () => {
    setObsList(prev => [...prev, ''])
  }

  const handleObsChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newList = [...obsList]
    newList[idx] = e.target.value
    setObsList(newList)
  }




  const clearCte = () => {
    setObsList([])
    setSinistroAdded(false)
    setCteSubmitted(false)
    setCteCopied(false)
  }

  const copyCteToClipboard = () => {
  if (!resultado) return;

  const parts = [
    ...obsList.map(text => text),
    sinistroAdded
      ? 'AO OCORRER SINISTRO LIGUE PARA A CENTRAL DO SEGURO ATRAVÉS DO TELEFONE 0800 292 1234'
      : '',
    `VALOR PRESTAÇÃO: ${formatarRS(parseFloat(frete.replace(',', '.')))} - VALOR ICMS(${taxa}%): ${formatarRS(resultado.valorICMS)}`,
    `CREDITO PRESUMIDO: ${formatarRS(resultado.creditoPresumido)} - ICMS A RECOLHER: ${formatarRS(resultado.icmsRecolher)}`,
  ].filter(line => line !== '').join('\n');

  // Copia como texto plano (sem formatação)
  navigator.clipboard.writeText(parts);
  setCteCopied(true);
};


  return (
    <div className="container">
      <div className="container_links">
        <Link className="message_trucker" to="/message">
          <button className="styled-button">
            📩 MENSAGENS MOTORISTA
          </button>
        </Link>

        <Link className="formatador_link" to="/formatador">
          <button className="styled-button">
            🧼 FORMATADOR DE CHAVES
          </button>
        </Link>

      </div>



      <h2 className="titulo">💰 Cálculo de ICMS</h2>

      <div className="formulario">
        <input
          type="text"
          value={frete}
          onChange={handleInput(setFrete)}
          placeholder="Valor da Prestação"
          className="input"
        />
        <input
          type="text"
          value={taxa}
          onChange={handleInput(setTaxa)}
          placeholder="Alíquota de ICMS (%)"
          className="input"
        />
      </div>

      <div className="botoes">
        <button onClick={calcularICMS} className="botao calcular">
          Calcular
        </button>
        <button onClick={limparTudo} className="botao limpar">
          Limpar Tudo
        </button>
      </div>

      {resultado && (
        <div className="resultado">
          <p>
            <strong>Valor da Prestação:</strong> {formatarRS(parseFloat(frete.replace(',', '.')))}
          </p>
          <p>
            <strong>Valor do ICMS ({taxa}%):</strong> {formatarRS(resultado.valorICMS)}
          </p>
          <p>
            <strong>Crédito Presumido (20%):</strong> {formatarRS(resultado.creditoPresumido)}
          </p>
          <p>
            <strong>ICMS a Recolher (80%):</strong> {formatarRS(resultado.icmsRecolher)}
          </p>

          <div className="botoes">
            <button onClick={openGuiaModal} className="botao info">
              Obs. Guia
            </button>
            <button onClick={openCteModal} className="botao info">
              Obs. CTe
            </button>
          </div>
        </div>
      )}

      {showGuiaModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Observação Guia</h3>
              <button onClick={closeGuiaModal} className="modal-close-btn">
                &times;
              </button>
            </div>
            <div className="modal-content">
              {!guiaSubmitted ? (
                <>
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="Número do CTe"
                    value={guiaNumero}
                    onChange={e => setGuiaNumero(e.target.value)}
                  />
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="Série do CTe"
                    value={guiaSerie}
                    onChange={e => setGuiaSerie(e.target.value)}
                  />
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="Nome do Motorista"
                    value={guiaMotorista}
                    onChange={e => setGuiaMotorista(e.target.value)}
                  />
                  <input
                    type="text"
                    className="modal-input"
                    placeholder="Linha"
                    value={guiaLinha}
                    onChange={e => setGuiaLinha(e.target.value)}
                  />

                  <div className="modal-button-group">
                    <button onClick={() => setGuiaSubmitted(true)} className="botao calcular">
                      Concluir
                    </button>
                    <button onClick={clearGuia} className="botao limpar">
                      Limpar Tudo
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>CTE: {guiaNumero}</p>
                  <p>SERIE: {guiaSerie}</p>
                  <p>MOTORISTA: {guiaMotorista}</p>
                  <p>LINHA: {guiaLinha}</p>
                  <p>VALOR PRESTAÇÃO: {formatarRS(parseFloat(frete.replace(',', '.')))}</p>
                  <p>VALOR ICMS({taxa}%): {formatarRS(resultado?.valorICMS || 0)}</p>
                  <p>CREDITO PRESUMIDO: {formatarRS(resultado?.creditoPresumido || 0)}</p>
                  <p>ICMS A RECOLHER: {formatarRS(resultado?.icmsRecolher || 0)}</p>

                  <div className="modal-button-group">
                    <button onClick={copyGuiaToClipboard} className="botao calcular">
                      Copiar
                    </button>
                    <button onClick={clearGuia} className="botao limpar">
                      Limpar Tudo
                    </button>
                  </div>
                  {guiaCopied && <span className="feedback">Copiado!</span>}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showCteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Observação CTe</h3>
              <button onClick={closeCteModal} className="modal-close-btn">
                &times;
              </button>
            </div>
            <div className="modal-content">
              {!cteSubmitted ? (
                <>
                  <div className="modal-button-group">
                    <button onClick={addObsInput} className="botao info">
                      Criar Input
                    </button>
                    <button
                      onClick={() => setSinistroAdded(prev => !prev)}
                      className={`botao calcular ${sinistroAdded ? 'ativo' : ''}`}
                    >
                      {sinistroAdded ? '✅ Sinistro Adicionado' : 'Adicionar Ocorrer sinistro'}
                    </button>
                  </div>

                  {obsList.map((obs, idx) => (
                    <input
                      key={idx}
                      type="text"
                      className="modal-input"
                      placeholder={`Observação ${idx + 1}`}
                      value={obs}
                      onChange={handleObsChange(idx)}
                    />
                  ))}

                  <div className="modal-button-group">
                    <button onClick={() => setCteSubmitted(true)} className="botao calcular">
                      Concluir
                    </button>
                    <button onClick={clearCte} className="botao limpar">
                      Limpar Tudo
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {obsList.map((obs, idx) => (
                    <p key={idx}>{obs}</p>
                  ))}
                  {sinistroAdded && (
                    <p>
                      AO OCORRES SINISTRO LIGUE PARA A CENTRAL DO SEGURO ATRAVÉS DO
                      TELEFONE 0800 292 1234
                    </p>
                  )}
                  <p>
                    VALOR PRESTAÇÃO: {formatarRS(parseFloat(frete.replace(',', '.')))} - VALOR
                    ICMS({taxa}%): {formatarRS(resultado?.valorICMS || 0)}
                  </p>
                  <p>
                    CREDITO PRESUMIDO: {formatarRS(resultado?.creditoPresumido || 0)} - ICMS A
                    RECOLHER: {formatarRS(resultado?.icmsRecolher || 0)}
                  </p>

                  <div className="modal-button-group">
                    <button onClick={copyCteToClipboard} className="botao calcular">
                      Copiar
                    </button>
                    <button onClick={clearCte} className="botao limpar">
                      Limpar Tudo
                    </button>
                  </div>
                  {cteCopied && <span className="feedback">Copiado!</span>}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App