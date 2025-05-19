"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useEscalonador, type Processo, type FatiaTempoExecucao } from "../contexto/ContextoEscalonador"
import { useTema } from "../contexto/ContextoTema"

const { width: LARGURA_TELA } = Dimensions.get("window")
const LARGURA_ITEM_LINHA_TEMPO = 30

const TelaSimulacao = () => {
  const navigation = useNavigation()
  const {
    processos,
    quantumTempo,
    sobrecargaTrocaContexto,
    velocidadeSimulacao,
    executarSimulacao,
    resultadoSimulacao,
    setResultadoSimulacao,
    simulacaoEmExecucao,
    setSimulacaoEmExecucao,
    gerarProcessosAleatorios,
  } = useEscalonador()
  const { cores } = useTema()

  const [tempoAtual, setTempoAtual] = useState(0)
  const [processosSimulacao, setProcessosSimulacao] = useState<Processo[]>([])
  const [linhaDoTempo, setLinhaDoTempo] = useState<FatiaTempoExecucao[]>([])
  const [executando, setExecutando] = useState(false)
  const [concluido, setConcluido] = useState(false)
  const refScrollLinhaDoTempo = useRef<ScrollView>(null)
  const refAnimacao = useRef<NodeJS.Timeout | null>(null)
  const animacaoFade = useRef(new Animated.Value(0)).current

  // Estatísticas de recursos
  const [utilizacaoCPU, setUtilizacaoCPU] = useState(0)
  const [processosFinalizados, setProcessosFinalizados] = useState(0)

  useEffect(() => {
    // Resetar estado da simulação quando a tela é focada
    return () => {
      if (refAnimacao.current) {
        clearTimeout(refAnimacao.current)
      }
      setSimulacaoEmExecucao(false)
    }
  }, [setSimulacaoEmExecucao])

  // Funções utilitárias para evitar shadowing de Math
  function safeCeil(val: number): number {
    return val % 1 === 0 ? val : (val - (val % 1)) + 1;
  }
  function safeMin(a: number, b: number): number {
    return a < b ? a : b;
  }
  function safeRandom(): number {
    // Gera um número pseudoaleatório simples
    return (Date.now() % 1000) / 1000;
  }

  const iniciarSimulacao = () => {
    // Gera 10 processos aleatórios em memória
    const processosGerados = Array.from({ length: 10 }, (_, i) => ({
      id: `P${i + 1}`,
      nome: `P${i + 1}`,
      tipo: (safeRandom() > 0.5 ? "cpu" : "io") as "cpu" | "io",
      tempoChegada: Math.floor(safeRandom() * 6),
      tempoExecucaoTotal: Math.floor(safeRandom() * 8) + 3,
      tempoRestanteCPU: 0,
      tempoRestanteIO: 0,
      bilhetes: Math.floor(safeRandom() * 10) + 1,
      cor: cores.primaria,
      estado: "pronto" as "pronto" | "executando" | "esperando" | "finalizado",
      tempoEspera: 0,
      tempoRetorno: 0,
      tempoResposta: null,
      tempoFinalizacao: null,
      ioBursts: [] as number[],
      cpuBursts: [] as number[],
      burstAtual: 0
    }))

    // Inicializa bursts para processos tipo io
    processosGerados.forEach(p => {
      if (p.tipo === "io") {
        let tempoRestante = p.tempoExecucaoTotal
        while (tempoRestante > 0) {
          const cpuBurst: number = safeMin(safeCeil(safeRandom() * 4), tempoRestante)
          (p.cpuBursts as number[]).push(cpuBurst)
          (p.ioBursts as number[]).push(2)
          tempoRestante -= cpuBurst
        }
        p.tempoRestanteCPU = p.cpuBursts[0]
      } else {
        p.cpuBursts = [p.tempoExecucaoTotal]
        p.tempoRestanteCPU = p.tempoExecucaoTotal
      }
    })

    // Lógica do escalonador preemptivo por sorteio
    let tempoAtual = 0
    let processos = processosGerados.map(p => ({ ...p }))
    let linhaDoTempo: FatiaTempoExecucao[] = []
    let processosFinalizados = 0
    let processoAtual: Processo | null = null
    let tempoExecutando = 0
    const quantum: number = 2
    let cpuOcupada = 0
    while (processosFinalizados < processos.length) {
      // Atualiza IO
      processos.forEach(p => {
        if (p.estado === "esperando") {
          p.tempoRestanteIO--
          if (p.tempoRestanteIO <= 0) {
            p.estado = "pronto"
            p.burstAtual++
            if (p.burstAtual < p.cpuBursts.length) {
              p.tempoRestanteCPU = p.cpuBursts[p.burstAtual]
            }
          }
        }
      })
      // Fila de prontos
      const prontos = processos.filter(p => p.estado === "pronto" && p.tempoChegada <= tempoAtual && p.tempoRestanteCPU > 0)
      // Sorteio
      if (!processoAtual || tempoExecutando >= quantum) {
        if (prontos.length > 0) {
          const totalBilhetes = prontos.reduce((acc, p) => acc + p.bilhetes, 0)
          let sorteio = Math.floor(Math.random() * totalBilhetes) + 1
          for (const p of prontos) {
            if (sorteio <= p.bilhetes) {
              processoAtual = p
              break
            }
            sorteio -= p.bilhetes
          }
          tempoExecutando = 0
          if (processoAtual && processoAtual.tempoResposta === null) {
            processoAtual.tempoResposta = tempoAtual - processoAtual.tempoChegada
          }
        } else {
          processoAtual = null
        }
      }
      // Execução
      if (processoAtual) {
        linhaDoTempo.push({ tempo: tempoAtual, processoId: processoAtual.id, tipo: processoAtual.tipo })
        processoAtual.tempoRestanteCPU--
        tempoExecutando++
        cpuOcupada++
        if (processoAtual.tempoRestanteCPU <= 0) {
          if (processoAtual.tipo === "io" && processoAtual.burstAtual < processoAtual.ioBursts.length) {
            processoAtual.tempoRestanteIO = processoAtual.ioBursts[processoAtual.burstAtual]
            processoAtual.estado = "esperando"
          } else {
            processoAtual.estado = "finalizado"
            processoAtual.tempoFinalizacao = tempoAtual + 1
            processoAtual.tempoRetorno = processoAtual.tempoFinalizacao - processoAtual.tempoChegada
            processosFinalizados++
          }
          processoAtual = null
        }
      } else {
        linhaDoTempo.push({ tempo: tempoAtual, processoId: null, tipo: "ocioso" })
      }
      // Atualiza tempo de espera
      processos.forEach(p => {
        if (p.estado === "pronto" && p !== processoAtual && p.tempoChegada <= tempoAtual && p.tempoRestanteCPU > 0) {
          p.tempoEspera++
        }
      })
      tempoAtual++
    }
    // Estatísticas
    const tempoTotal = linhaDoTempo.length
    const tempoOcioso = linhaDoTempo.filter(f => f.tipo === "ocioso").length
    const usoCPU = Math.round((cpuOcupada / tempoTotal) * 100)
    setLinhaDoTempo(linhaDoTempo)
    setProcessosSimulacao(processos.sort((a, b) => (a.tempoFinalizacao ?? 0) - (b.tempoFinalizacao ?? 0)))
    setTempoAtual(0)
    setExecutando(false)
    setConcluido(false)
    setSimulacaoEmExecucao(true)
    setUtilizacaoCPU(usoCPU)
    setProcessosFinalizados(processos.filter(p => p.estado === "finalizado").length)
    Animated.timing(animacaoFade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  const executarPausarSimulacao = () => {
    if (concluido) {
      // Reiniciar simulação
      setTempoAtual(0)
      setConcluido(false)
      setExecutando(true)
      executarPassoAnimacao()
    } else {
      setExecutando(!executando)
      if (!executando) {
        executarPassoAnimacao()
      } else if (refAnimacao.current) {
        clearTimeout(refAnimacao.current)
      }
    }
  }

  const executarPassoAnimacao = () => {
    if (tempoAtual < linhaDoTempo.length - 1) {
      // Calcular atraso com base na velocidade de simulação (1-5)
      // Valor menor = simulação mais rápida
      const atraso = 1000 / velocidadeSimulacao

      refAnimacao.current = setTimeout(() => {
        setTempoAtual((prev) => {
          const novoTempo = prev + 1

          // Atualizar estatísticas de recursos
          const tempoCorrido = novoTempo + 1
          const tempoOcioso = linhaDoTempo.slice(0, tempoCorrido).filter((fatia) => fatia.processoId === null).length
          const novaUtilizacaoCPU = ((tempoCorrido - tempoOcioso) / tempoCorrido) * 100
          setUtilizacaoCPU(novaUtilizacaoCPU)

          // Contar processos finalizados até o momento atual
          const processosFinalizadosAteAgora = processosSimulacao.filter(
            (p) => p.tempoFinalizacao !== null && p.tempoFinalizacao <= novoTempo,
          ).length
          setProcessosFinalizados(processosFinalizadosAteAgora)

          return novoTempo
        })

        // Rolar linha do tempo para manter o tempo atual visível
        if (refScrollLinhaDoTempo.current) {
          refScrollLinhaDoTempo.current.scrollTo({
            x: Math.max(0, (tempoAtual + 1) * LARGURA_ITEM_LINHA_TEMPO - LARGURA_TELA / 2),
            animated: true,
          })
        }

        if (executando) {
          executarPassoAnimacao()
        }
      }, atraso)
    } else {
      setExecutando(false)
      setConcluido(true)
    }
  }

  useEffect(() => {
    if (executando && !refAnimacao.current) {
      executarPassoAnimacao()
    }

    return () => {
      if (refAnimacao.current) {
        clearTimeout(refAnimacao.current)
        refAnimacao.current = null
      }
    }
  }, [executando])

  const resetarSimulacao = () => {
    if (refAnimacao.current) {
      clearTimeout(refAnimacao.current)
      refAnimacao.current = null
    }
    setTempoAtual(0)
    setExecutando(false)
    setConcluido(false)
    setUtilizacaoCPU(0)
    setProcessosFinalizados(0)
  }

  const verResultados = () => {
    navigation.navigate("Resultados" as never)
  }

  const verProcessosFinalizados = () => {
    navigation.navigate("ProcessosFinalizados" as never)
  }

  const obterEstadoProcesso = (processo: Processo, tempo: number) => {
    // Verificar se o processo está executando neste tempo
    const fatiaTempoExecucao = linhaDoTempo[tempo]
    if (!fatiaTempoExecucao) return processo.estado

    if (fatiaTempoExecucao.processoId === processo.id) {
      return "executando"
    }

    // Verificar se o processo chegou mas não foi finalizado
    if (processo.tempoChegada <= tempo && (processo.tempoFinalizacao === null || tempo < processo.tempoFinalizacao)) {
      return "pronto"
    }

    // Verificar se o processo foi finalizado
    if (processo.tempoFinalizacao !== null && tempo >= processo.tempoFinalizacao) {
      return "finalizado"
    }

    // Processo ainda não chegou
    return "esperando"
  }

  const renderItemLinhaDoTempo = (fatia: FatiaTempoExecucao, indice: number) => {
    const ehTempoAtual = indice === tempoAtual
    const processo = fatia.processoId ? processosSimulacao.find((p) => p.id === fatia.processoId) : null

    const corFundo = processo ? processo.cor : cores.corOciosa

    return (
      <View
        key={`tempo-${indice}`}
        style={[estilos.itemLinhaDoTempo, { backgroundColor: corFundo }, ehTempoAtual && estilos.itemLinhaDoTempoAtual]}
      >
        <Text style={estilos.textoItemLinhaDoTempo}>{indice}</Text>
        {processo && <Text style={estilos.textoProcessoLinhaDoTempo}>{processo.nome}</Text>}
      </View>
    )
  }

  const estilos = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.fundo,
    },
    cabecalho: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
    },
    titulo: {
      fontSize: 18,
      fontWeight: "bold",
      color: cores.texto,
      marginBottom: 8,
    },
    subtitulo: {
      fontSize: 14,
      color: cores.texto,
      opacity: 0.7,
    },
    containerSimulacao: {
      flex: 1,
      padding: 16,
    },
    containerControles: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: cores.borda,
    },
    botaoControle: {
      alignItems: "center",
    },
    textoBotaoControle: {
      color: cores.primaria,
      marginTop: 4,
    },
    containerLinhaDoTempo: {
      marginTop: 16,
      marginBottom: 16,
    },
    labelLinhaDoTempo: {
      fontSize: 16,
      fontWeight: "bold",
      color: cores.texto,
      marginBottom: 8,
    },
    scrollLinhaDoTempo: {
      backgroundColor: cores.fundoLinhaDoTempo,
      borderRadius: 8,
      padding: 8,
    },
    conteudoLinhaDoTempo: {
      flexDirection: "row",
    },
    itemLinhaDoTempo: {
      width: LARGURA_ITEM_LINHA_TEMPO,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: cores.fundo,
    },
    itemLinhaDoTempoAtual: {
      borderWidth: 2,
      borderColor: cores.destaque,
    },
    textoItemLinhaDoTempo: {
      fontSize: 10,
      color: "#fff",
      fontWeight: "bold",
    },
    textoProcessoLinhaDoTempo: {
      fontSize: 10,
      color: "#fff",
    },
    containerProcessos: {
      marginTop: 16,
    },
    labelProcessos: {
      fontSize: 16,
      fontWeight: "bold",
      color: cores.texto,
      marginBottom: 8,
    },
    itemProcesso: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: cores.cartao,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    corProcesso: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginRight: 12,
    },
    infoProcesso: {
      flex: 1,
    },
    nomeProcesso: {
      fontSize: 16,
      fontWeight: "bold",
      color: cores.texto,
    },
    detalhesProcesso: {
      flexDirection: "row",
      marginTop: 4,
    },
    detalheProcesso: {
      fontSize: 12,
      color: cores.texto,
      opacity: 0.7,
      marginRight: 8,
    },
    estadoProcesso: {
      fontSize: 12,
      fontWeight: "bold",
      padding: 4,
      borderRadius: 4,
      overflow: "hidden",
    },
    estadoEsperando: {
      backgroundColor: "#9e9e9e",
      color: "#fff",
    },
    estadoPronto: {
      backgroundColor: "#2196f3",
      color: "#fff",
    },
    estadoExecutando: {
      backgroundColor: "#4caf50",
      color: "#fff",
    },
    estadoFinalizado: {
      backgroundColor: "#9c27b0",
      color: "#fff",
    },
    botaoIniciar: {
      backgroundColor: cores.primaria,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      margin: 16,
    },
    textoBotaoIniciar: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    containerSemProcessos: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    textoSemProcessos: {
      fontSize: 16,
      color: cores.texto,
      opacity: 0.7,
      textAlign: "center",
      marginBottom: 16,
    },
    infoSimulacao: {
      backgroundColor: cores.cartao,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    textoInfoSimulacao: {
      color: cores.texto,
      marginBottom: 4,
    },
    textoTempoAtual: {
      fontSize: 16,
      fontWeight: "bold",
      color: cores.primaria,
      marginTop: 8,
    },
    containerRecursos: {
      backgroundColor: cores.cartao,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    tituloRecursos: {
      fontSize: 16,
      fontWeight: "bold",
      color: cores.texto,
      marginBottom: 8,
    },
    itemRecurso: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    labelRecurso: {
      color: cores.texto,
    },
    valorRecurso: {
      fontWeight: "bold",
      color: cores.primaria,
    },
    barraProgresso: {
      height: 8,
      backgroundColor: cores.borda,
      borderRadius: 4,
      marginTop: 4,
      marginBottom: 12,
    },
    progressoUtilizacao: {
      height: 8,
      backgroundColor: cores.primaria,
      borderRadius: 4,
    },
    cardControles: {
      backgroundColor: cores.cartao,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      marginTop: 8,
      alignItems: "center",
      elevation: 2,
    },
    linhaControles: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      width: "100%",
      gap: 8,
    },
    botaoControle: {
      alignItems: "center",
      marginHorizontal: 8,
      marginVertical: 4,
      minWidth: 70,
    },
    textoBotaoControle: {
      color: cores.primaria,
      marginTop: 4,
      fontSize: 12,
      fontWeight: "bold",
    },
  })

  if (!simulacaoEmExecucao) {
    return (
      <View style={estilos.container}>
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Simulação de Escalonador de Loteria Preemptivo</Text>
          <Text style={estilos.subtitulo}>
            Configure os processos no Gerenciador de Processos antes de executar a simulação
          </Text>
        </View>

        <View style={estilos.infoSimulacao}>
          <Text style={estilos.textoInfoSimulacao}>Quantum de Tempo: {quantumTempo} unidades de tempo</Text>
          <Text style={estilos.textoInfoSimulacao}>
            Sobrecarga de Troca de Contexto: {sobrecargaTrocaContexto} unidades de tempo
          </Text>
          <Text style={estilos.textoInfoSimulacao}>Processos: {processos.length}</Text>
        </View>

        {processos.length === 0 ? (
          <View style={estilos.containerSemProcessos}>
            <Text style={estilos.textoSemProcessos}>
              Nenhum processo adicionado ainda. Adicione processos no Gerenciador de Processos antes de executar a
              simulação.
            </Text>
            <TouchableOpacity
              style={estilos.botaoIniciar}
              onPress={() => navigation.navigate("GerenciadorProcessos" as never)}
            >
              <Text style={estilos.textoBotaoIniciar}>Ir para Gerenciador de Processos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={estilos.botaoIniciar} onPress={iniciarSimulacao}>
            <Text style={estilos.textoBotaoIniciar}>Iniciar Simulação</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.cardControles}>
        <View style={estilos.linhaControles}>
          <TouchableOpacity style={estilos.botaoControle} onPress={resetarSimulacao}>
            <Ionicons name="refresh" size={24} color={cores.primaria} />
            <Text style={estilos.textoBotaoControle}>Resetar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botaoControle} onPress={executarPausarSimulacao}>
            <Ionicons name={executando ? "pause" : "play"} size={24} color={cores.primaria} />
            <Text style={estilos.textoBotaoControle}>
              {executando ? "Pausar" : concluido ? "Reiniciar" : "Executar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botaoControle} onPress={verResultados} disabled={!concluido}>
            <Ionicons name="stats-chart" size={24} color={concluido ? cores.primaria : cores.texto + "40"} />
            <Text style={[estilos.textoBotaoControle, !concluido && { color: cores.texto + "40" }]}>Resultados</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botaoControle} onPress={verProcessosFinalizados} disabled={!concluido}>
            <Ionicons name="list" size={24} color={concluido ? cores.primaria : cores.texto + "40"} />
            <Text style={[estilos.textoBotaoControle, !concluido && { color: cores.texto + "40" }]}>Finalizados</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View style={{ flex: 1, opacity: animacaoFade }}>
        <View style={estilos.containerSimulacao}>
          <View style={estilos.infoSimulacao}>
            <Text style={estilos.textoInfoSimulacao}>Quantum de Tempo: {quantumTempo} unidades de tempo</Text>
            <Text style={estilos.textoInfoSimulacao}>
              Sobrecarga de Troca de Contexto: {sobrecargaTrocaContexto} unidades de tempo
            </Text>
            <Text style={estilos.textoTempoAtual}>Tempo Atual: {tempoAtual}</Text>
          </View>

          <View style={estilos.containerRecursos}>
            <Text style={estilos.tituloRecursos}>Consumo de Recursos</Text>

            <View style={estilos.itemRecurso}>
              <Text style={estilos.labelRecurso}>Utilização da CPU</Text>
              <Text style={estilos.valorRecurso}>{utilizacaoCPU.toFixed(1)}%</Text>
            </View>
            <View style={estilos.barraProgresso}>
              <View style={[estilos.progressoUtilizacao, { width: `${utilizacaoCPU}%` }]} />
            </View>

            <View style={estilos.itemRecurso}>
              <Text style={estilos.labelRecurso}>Processos Finalizados</Text>
              <Text style={estilos.valorRecurso}>
                {processosFinalizados} de {processosSimulacao.length}
              </Text>
            </View>
            <View style={estilos.barraProgresso}>
              <View
                style={[
                  estilos.progressoUtilizacao,
                  { width: `${(processosFinalizados / processosSimulacao.length) * 100}%` },
                ]}
              />
            </View>
          </View>

          {!executando && !concluido && (
            <View style={[estilos.containerRecursos, { backgroundColor: cores.primaria + "10" }]}>
              <Text style={[estilos.tituloRecursos, { color: cores.primaria }]}>Dica Educacional</Text>
              <Text style={{ color: cores.texto, marginBottom: 8 }}>
                Observe como o algoritmo de loteria seleciona os processos com base em seus bilhetes. Processos com mais
                bilhetes têm maior probabilidade de serem escolhidos, mas mesmo processos com poucos bilhetes
                eventualmente serão executados.
              </Text>
              <Text style={{ color: cores.texto }}>
                Pressione "Executar" para iniciar a simulação passo a passo, ou use os controles para avançar mais
                rapidamente.
              </Text>
            </View>
          )}

          <View style={estilos.containerLinhaDoTempo}>
            <Text style={estilos.labelLinhaDoTempo}>Linha do Tempo</Text>
            <ScrollView
              ref={refScrollLinhaDoTempo}
              horizontal
              style={estilos.scrollLinhaDoTempo}
              contentContainerStyle={estilos.conteudoLinhaDoTempo}
              showsHorizontalScrollIndicator={true}
            >
              {linhaDoTempo.map((fatia, indice) => renderItemLinhaDoTempo(fatia, indice))}
            </ScrollView>
          </View>

          <View style={estilos.containerProcessos}>
            <Text style={estilos.labelProcessos}>Processos</Text>
            <ScrollView>
              {processosSimulacao.map((processo) => {
                const estadoAtual = obterEstadoProcesso(processo, tempoAtual)
                let estiloEstado
                switch (estadoAtual) {
                  case "esperando":
                    estiloEstado = estilos.estadoEsperando
                    break
                  case "pronto":
                    estiloEstado = estilos.estadoPronto
                    break
                  case "executando":
                    estiloEstado = estilos.estadoExecutando
                    break
                  case "finalizado":
                    estiloEstado = estilos.estadoFinalizado
                    break
                }

                return (
                  <View key={processo.id} style={estilos.itemProcesso}>
                    <View style={[estilos.corProcesso, { backgroundColor: processo.cor }]} />
                    <View style={estilos.infoProcesso}>
                      <Text style={estilos.nomeProcesso}>{processo.nome}</Text>
                      <View style={estilos.detalhesProcesso}>
                        <Text style={estilos.detalheProcesso}>Chegada: {processo.tempoChegada}</Text>
                        <Text style={estilos.detalheProcesso}>Execução: {processo.tempoExecucaoTotal}</Text>
                        <Text style={estilos.detalheProcesso}>Bilhetes: {processo.bilhetes}</Text>
                      </View>
                    </View>
                    <Text style={[estilos.estadoProcesso, estiloEstado]}>
                      {estadoAtual === "esperando"
                        ? "ESPERANDO"
                        : estadoAtual === "pronto"
                          ? "PRONTO"
                          : estadoAtual === "executando"
                            ? "EXECUTANDO"
                            : "FINALIZADO"}
                    </Text>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        </View>
      </Animated.View>
    </View>
  )
}

export default TelaSimulacao
