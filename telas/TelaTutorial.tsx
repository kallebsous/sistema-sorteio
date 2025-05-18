"use client"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { useTema } from "../contexto/ContextoTema"

const TelaTutorial = () => {
  const { cores } = useTema()

  const estilos = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.fundo,
    },
    conteudo: {
      padding: 16,
    },
    secao: {
      backgroundColor: cores.cartao,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    titulo: {
      fontSize: 20,
      fontWeight: "bold",
      color: cores.texto,
      marginBottom: 16,
    },
    subtitulo: {
      fontSize: 18,
      fontWeight: "bold",
      color: cores.texto,
      marginTop: 16,
      marginBottom: 8,
    },
    paragrafo: {
      fontSize: 14,
      color: cores.texto,
      lineHeight: 22,
      marginBottom: 12,
    },
    itemLista: {
      flexDirection: "row",
      marginBottom: 8,
      paddingLeft: 8,
    },
    marcador: {
      fontSize: 14,
      color: cores.primaria,
      marginRight: 8,
      fontWeight: "bold",
    },
    textoLista: {
      flex: 1,
      fontSize: 14,
      color: cores.texto,
      lineHeight: 22,
    },
    blocoCodigo: {
      backgroundColor: cores.ehEscuro ? "#1e1e1e" : "#f5f5f5",
      padding: 12,
      borderRadius: 4,
      marginVertical: 12,
    },
    textoCodigo: {
      fontFamily: "monospace",
      fontSize: 12,
      color: cores.ehEscuro ? "#e0e0e0" : "#333333",
    },
    imagem: {
      width: "100%",
      height: 200,
      resizeMode: "contain",
      marginVertical: 16,
      backgroundColor: cores.ehEscuro ? "#333" : "#f9f9f9",
      borderRadius: 8,
    },
    destaque: {
      backgroundColor: cores.primaria + "30",
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    textoDestaque: {
      color: cores.primaria,
      fontWeight: "bold",
    },
    caixaInfo: {
      backgroundColor: cores.primaria + "15",
      borderLeftWidth: 4,
      borderLeftColor: cores.primaria,
      padding: 12,
      marginVertical: 12,
      borderRadius: 4,
    },
    textoInfo: {
      color: cores.texto,
      fontSize: 14,
      lineHeight: 20,
    },
    tabelaComparativa: {
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: 4,
      marginVertical: 12,
      overflow: "hidden",
    },
    linhaTabelaHeader: {
      flexDirection: "row",
      backgroundColor: cores.primaria + "30",
    },
    linhaTabela: {
      flexDirection: "row",
      borderTopWidth: 1,
      borderTopColor: cores.borda,
    },
    celulaTabela: {
      flex: 1,
      padding: 8,
      borderRightWidth: 1,
      borderRightColor: cores.borda,
    },
    ultimaCelulaTabela: {
      flex: 1,
      padding: 8,
    },
    textoTabelaHeader: {
      fontWeight: "bold",
      color: cores.texto,
      textAlign: "center",
    },
    textoTabela: {
      color: cores.texto,
    },
  })

  return (
    <ScrollView style={estilos.container}>
      <View style={estilos.conteudo}>
        <View style={estilos.secao}>
          <Text style={estilos.titulo}>Objetivo Educacional</Text>
          <Text style={estilos.paragrafo}>
            Este simulador foi desenvolvido como uma ferramenta educacional para ajudar estudantes de Sistemas
            Operacionais a compreenderem o funcionamento do escalonamento de loteria preemptivo. Através da visualização
            interativa e simulação passo a passo, os alunos podem:
          </Text>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              Observar como os processos são selecionados com base em seus bilhetes de loteria
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>Entender o impacto da preempção no tempo de execução dos processos</Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              Analisar métricas de desempenho como tempo de espera, tempo de retorno e utilização da CPU
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              Experimentar diferentes configurações e observar seus efeitos no comportamento do sistema
            </Text>
          </View>

          <View style={estilos.caixaInfo}>
            <Text style={estilos.textoInfo}>
              <Text style={{ fontWeight: "bold" }}>Dica para professores:</Text> Sugira que os alunos criem diferentes
              cenários de processos e comparem os resultados obtidos com outros algoritmos de escalonamento como FCFS,
              SJF e Round Robin.
            </Text>
          </View>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.titulo}>O que é Escalonamento de Loteria?</Text>
          <Text style={estilos.paragrafo}>
            O escalonamento de loteria é um algoritmo de escalonamento probabilístico para sistemas operacionais,
            proposto por Carl Waldspurger em 1994. Ele usa bilhetes de loteria para representar a parcela de um recurso
            que um processo deve receber. Quanto mais bilhetes um processo tiver, maior será sua probabilidade de ser
            selecionado para execução.
          </Text>

          <Text style={estilos.subtitulo}>Conceitos Fundamentais</Text>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Bilhetes:</Text> Representam a parcela de tempo de CPU que um processo
              deve receber. Processos com mais bilhetes têm maior chance de serem selecionados.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Loteria:</Text> Um sorteio aleatório seleciona o próximo processo a
              ser executado com base no número de bilhetes que cada processo possui.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Justiça:</Text> Ao longo do tempo, os processos recebem tempo de CPU
              proporcional às suas alocações de bilhetes.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Responsividade:</Text> Mesmo processos de baixa prioridade têm chance
              de executar, evitando inanição.
            </Text>
          </View>

          <Text style={estilos.subtitulo}>Exemplo Prático</Text>
          <Text style={estilos.paragrafo}>
            Imagine três processos: A, B e C com 10, 20 e 30 bilhetes respectivamente. O total de bilhetes é 60.
          </Text>
          <Text style={estilos.paragrafo}>• Processo A tem 10/60 = 16,7% de chance de ser selecionado</Text>
          <Text style={estilos.paragrafo}>• Processo B tem 20/60 = 33,3% de chance de ser selecionado</Text>
          <Text style={estilos.paragrafo}>• Processo C tem 30/60 = 50% de chance de ser selecionado</Text>
          <Text style={estilos.paragrafo}>
            Ao longo do tempo, o processo C receberá aproximadamente 50% do tempo de CPU, o processo B 33,3% e o
            processo A 16,7%.
          </Text>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.titulo}>Escalonamento de Loteria Preemptivo</Text>
          <Text style={estilos.paragrafo}>
            No escalonamento de loteria preemptivo, o escalonador pode interromper um processo em execução e selecionar
            um novo com base em um sorteio de loteria. Isso acontece em intervalos regulares chamados de quantum de
            tempo.
          </Text>

          <Text style={estilos.subtitulo}>Funcionamento do Algoritmo</Text>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>1.</Text>
            <Text style={estilos.textoLista}>
              Cada processo recebe um número de bilhetes de loteria com base em sua prioridade.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>2.</Text>
            <Text style={estilos.textoLista}>
              A cada decisão de escalonamento (após um quantum de tempo expirar ou quando um novo processo chega), uma
              loteria é realizada.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>3.</Text>
            <Text style={estilos.textoLista}>
              Um bilhete aleatório é sorteado, e o processo que possui esse bilhete é o próximo a ser executado.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>4.</Text>
            <Text style={estilos.textoLista}>
              O processo selecionado é executado por um quantum de tempo ou até que seja concluído ou bloqueado.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>5.</Text>
            <Text style={estilos.textoLista}>
              O processo é interrompido após o quantum de tempo, e uma nova loteria é realizada.
            </Text>
          </View>

          <Text style={estilos.subtitulo}>Pseudocódigo do Algoritmo</Text>

          <View style={estilos.blocoCodigo}>
            <Text style={estilos.textoCodigo}>
              {`// Pseudocódigo para escalonamento de loteria
function selecionarProximoProcesso(processosEmProntos) {
  // Contar total de bilhetes
  totalBilhetes = 0
  para cada processo em processosEmProntos {
    totalBilhetes += processo.bilhetes
  }
  
  // Sortear um bilhete aleatório
  bilheteVencedor = aleatorio(1, totalBilhetes)
  
  // Encontrar o processo com o bilhete vencedor
  contador = 0
  para cada processo em processosEmProntos {
    contador += processo.bilhetes
    se (contador >= bilheteVencedor) {
      retornar processo
    }
  }
}`}
            </Text>
          </View>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.titulo}>Comparação com Outros Algoritmos</Text>

          <Text style={estilos.paragrafo}>
            Para entender melhor o escalonamento de loteria, é útil compará-lo com outros algoritmos comuns:
          </Text>

          <View style={estilos.tabelaComparativa}>
            <View style={estilos.linhaTabelaHeader}>
              <View style={estilos.celulaTabela}>
                <Text style={estilos.textoTabelaHeader}>Algoritmo</Text>
              </View>
              <View style={estilos.celulaTabela}>
                <Text style={estilos.textoTabelaHeader}>Princípio</Text>
              </View>
              <View style={estilos.ultimaCelulaTabela}>
                <Text style={estilos.textoTabelaHeader}>Características</Text>
              </View>
            </View>

            <View style={estilos.linhaTabela}>
              <View style={estilos.celulaTabela}>
                <Text style={estilos.textoTabela}>FCFS</Text>
              </View>
              <View style={estilos.celulaTabela}>
                <Text style={estilos.textoTabela}>Primeiro a chegar, primeiro a ser atendido</Text>
              </View>
              <View style={estilos.ultimaCelulaTabela}>
                <Text style={estilos.textoTabela}>Simples, não preemptivo, pode causar efeito comboio</Text>
              </View>
            </View>

            <View style={estilos.linhaTabela}>
              <View style={estilos.celulaTabela}>
                <Text style={estilos.textoTabela}>SJF</Text>
              </View>
              <View style={estilos.celulaTabela}>
                <Text style={estilos.textoTabela}>Menor tempo de execução primeiro</Text>
              </View>
              <View style={estilos.ultimaCelulaTabela}>
                <Text style={estilos.textoTabela}>Ótimo para tempo médio de espera, pode causar inanição</Text>
              </View>
            </View>

            <View style={estilos.linhaTabela}>
              <View style={estilos.celulaTabela}>
                <Text style={estilos.textoTabela}>Round Robin</Text>
              </View>
              <View style={estilos.celulaTabela}>
                <Text style={estilos.textoTabela}>Alternância cíclica com quantum de tempo</Text>
              </View>
              <View style={estilos.ultimaCelulaTabela}>
                <Text style={estilos.textoTabela}>Preemptivo, justo, bom para tempo de resposta</Text>
              </View>
            </View>

            <View style={estilos.linhaTabela}>
              <View style={estilos.celulaTabela}>
                <Text style={estilos.textoTabela}>Loteria</Text>
              </View>
              <View style={estilos.celulaTabela}>
                <Text style={estilos.textoTabela}>Probabilístico baseado em bilhetes</Text>
              </View>
              <View style={estilos.ultimaCelulaTabela}>
                <Text style={estilos.textoTabela}>Preemptivo, proporcional, evita inanição</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.titulo}>Aplicações Práticas</Text>

          <Text style={estilos.paragrafo}>O escalonamento de loteria é particularmente útil em cenários onde:</Text>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Compartilhamento proporcional:</Text> É necessário alocar recursos de
              forma proporcional entre diferentes usuários ou aplicações.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Sistemas de virtualização:</Text> Para distribuir recursos de CPU
              entre máquinas virtuais.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Sistemas multimídia:</Text> Onde diferentes aplicações têm diferentes
              requisitos de recursos.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Computação em nuvem:</Text> Para alocação justa de recursos entre
              diferentes clientes.
            </Text>
          </View>

          <View style={estilos.caixaInfo}>
            <Text style={estilos.textoInfo}>
              <Text style={{ fontWeight: "bold" }}>Exemplo real:</Text> O sistema Xen de virtualização implementou uma
              variante do escalonamento de loteria chamada Credit Scheduler para distribuir recursos de CPU entre
              máquinas virtuais.
            </Text>
          </View>
        </View>

        <View style={estilos.secao}>
          <Text style={estilos.titulo}>Como Usar Este Simulador</Text>

          <Text style={estilos.subtitulo}>Exercícios Sugeridos</Text>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>1.</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Comparação de prioridades:</Text> Crie três processos com diferentes
              números de bilhetes (ex: 1, 5, 10) e observe como o tempo de CPU é distribuído entre eles.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>2.</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Efeito do quantum:</Text> Experimente diferentes valores de quantum de
              tempo e observe como isso afeta o tempo de resposta e o tempo de retorno dos processos.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>3.</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Sobrecarga de troca de contexto:</Text> Ajuste a sobrecarga de troca
              de contexto e observe seu impacto na utilização da CPU e no tempo total de execução.
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>4.</Text>
            <Text style={estilos.textoLista}>
              <Text style={estilos.textoDestaque}>Cenário de inanição:</Text> Tente criar um cenário onde um processo
              com poucos bilhetes ainda consegue ser executado, demonstrando como o escalonamento de loteria evita
              inanição.
            </Text>
          </View>

          <Text style={estilos.subtitulo}>Perguntas para Reflexão</Text>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>Como o número de bilhetes afeta o tempo de espera de um processo?</Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              Qual é a relação entre o quantum de tempo e a responsividade do sistema?
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              Como o escalonamento de loteria se compara ao Round Robin em termos de justiça?
            </Text>
          </View>

          <View style={estilos.itemLista}>
            <Text style={estilos.marcador}>•</Text>
            <Text style={estilos.textoLista}>
              Em quais situações o escalonamento de loteria seria mais adequado que outros algoritmos?
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default TelaTutorial
