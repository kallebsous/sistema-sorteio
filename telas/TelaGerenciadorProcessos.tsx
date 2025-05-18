"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import { useEscalonador, type Processo, type TipoProcesso } from "../contexto/ContextoEscalonador"
import { useTema } from "../contexto/ContextoTema"

const TelaGerenciadorProcessos = () => {
  const { 
    processos, 
    adicionarProcesso, 
    atualizarProcesso, 
    excluirProcesso, 
    gerarProcessosAleatorios,
    tempoIO,
    setTempoIO
  } = useEscalonador()
  const { cores } = useTema()
  const [modalVisivel, setModalVisivel] = useState(false)
  const [processoEditando, setProcessoEditando] = useState<Processo | null>(null)
  const [nomeProcesso, setNomeProcesso] = useState("")
  const [tipoProcesso, setTipoProcesso] = useState<TipoProcesso>("cpu")
  const [tempoChegada, setTempoChegada] = useState("")
  const [tempoExecucaoTotal, setTempoExecucaoTotal] = useState("")
  const [bilhetes, setBilhetes] = useState("")
  const [quantidadeAleatoria, setQuantidadeAleatoria] = useState("10")

  const abrirModalAdicionar = () => {
    setProcessoEditando(null)
    setNomeProcesso("")
    setTipoProcesso("cpu")
    setTempoChegada("")
    setTempoExecucaoTotal("")
    setBilhetes("")
    setModalVisivel(true)
  }

  const abrirModalEditar = (processo: Processo) => {
    setProcessoEditando(processo)
    setNomeProcesso(processo.nome)
    setTipoProcesso(processo.tipo)
    setTempoChegada(processo.tempoChegada.toString())
    setTempoExecucaoTotal(processo.tempoExecucaoTotal.toString())
    setBilhetes(processo.bilhetes.toString())
    setModalVisivel(true)
  }

  const handleSalvarProcesso = () => {
    if (!nomeProcesso.trim()) {
      Alert.alert("Erro", "Nome do processo é obrigatório")
      return
    }

    const validarNumero = (valor: string, nomeCampo: string, min: number, max: number) => {
      const num = Number(valor)
      if (isNaN(num) || num < min || num > max) {
        Alert.alert("Erro", `${nomeCampo} deve ser entre ${min} e ${max}`)
        return false
      }
      return true
    }

    if (
      !validarNumero(tempoChegada, "Tempo de Chegada", 0, 100) ||
      !validarNumero(tempoExecucaoTotal, "Tempo de Execução Total", 1, 100) ||
      !validarNumero(bilhetes, "Bilhetes", 1, 100)
    ) return

    const novoProcesso = {
      nome: nomeProcesso.trim(),
      tipo: tipoProcesso,
      tempoChegada: Number(tempoChegada),
      tempoExecucaoTotal: Number(tempoExecucaoTotal),
      bilhetes: Number(bilhetes),
    }

    if (processoEditando) {
      atualizarProcesso({ ...processoEditando, ...novoProcesso })
    } else {
      adicionarProcesso(novoProcesso)
    }

    setModalVisivel(false)
  }

  const handleExcluirProcesso = (id: string) => {
    Alert.alert("Excluir Processo", "Tem certeza que deseja excluir este processo?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", onPress: () => excluirProcesso(id), style: "destructive" },
    ])
  }

  const handleGerarAleatorios = () => {
    const quantidade = Number(quantidadeAleatoria)
    if (isNaN(quantidade)) {
      Alert.alert("Erro", "Digite um número válido")
      return
    }
    gerarProcessosAleatorios(Math.min(quantidade, 15))
  }

  const renderItemProcesso = ({ item }: { item: Processo }) => (
    <View style={[estilos.itemProcesso, { backgroundColor: cores.cartao }]}>
      <View style={[estilos.corProcesso, { backgroundColor: item.cor }]} />
      <View style={estilos.infoProcesso}>
        <View style={estilos.cabecalhoProcesso}>
          <Text style={[estilos.nomeProcesso, { color: cores.texto }]}>{item.nome}</Text>
          <View style={[
            estilos.tipoProcesso, 
            { backgroundColor: item.tipo === 'cpu' ? cores.primaria : cores.secundaria }
          ]}>
            <Text style={estilos.textoTipo}>{item.tipo.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={estilos.detalhesProcesso}>
          <Text style={[estilos.detalheProcesso, { color: cores.texto }]}>
            Chegada: {item.tempoChegada} | Execução: {item.tempoExecucaoTotal}
          </Text>
          <Text style={[estilos.detalheProcesso, { color: cores.texto }]}>
            Bilhetes: {item.bilhetes}
          </Text>
          {item.tipo === 'io' && (
            <View style={estilos.detalhesIO}>
              <Text style={[estilos.detalheProcesso, { color: cores.texto }]}>
                CPU Bursts: {item.cpuBursts.join(', ')}
              </Text>
              <Text style={[estilos.detalheProcesso, { color: cores.texto }]}>
                I/O Bursts: {item.ioBursts.join(', ')}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={estilos.acoesProcesso}>
        <TouchableOpacity 
          style={estilos.botaoAcao} 
          onPress={() => abrirModalEditar(item)}
        >
          <Ionicons name="pencil" size={20} color={cores.primaria} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={estilos.botaoAcao} 
          onPress={() => handleExcluirProcesso(item.id)}
        >
          <Ionicons name="trash" size={20} color={cores.erro} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const estilos = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: cores.fundo,
      padding: 16,
    },
    containerAleatorio: {
      backgroundColor: cores.cartao,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputAleatorio: {
      backgroundColor: cores.fundo,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: 4,
      padding: 8,
      width: 50,
      marginHorizontal: 8,
      color: cores.texto,
      textAlign: 'center',
    },
    textoAleatorio: {
      color: cores.texto,
      flex: 1,
    },
    botaoAleatorio: {
      backgroundColor: cores.primaria,
      borderRadius: 4,
      padding: 8,
      paddingHorizontal: 12,
    },
    textoBotaoAleatorio: {
      color: 'white',
      fontWeight: 'bold',
    },
    itemProcesso: {
      flexDirection: 'row',
      borderRadius: 8,
      marginBottom: 12,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    corProcesso: {
      width: 12,
    },
    infoProcesso: {
      flex: 1,
      padding: 12,
    },
    cabecalhoProcesso: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    nomeProcesso: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    tipoProcesso: {
      borderRadius: 12,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    textoTipo: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    detalhesProcesso: {
      marginTop: 8,
    },
    detalheProcesso: {
      fontSize: 12,
      marginBottom: 4,
    },
    detalhesIO: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: cores.borda,
    },
    acoesProcesso: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
    },
    botaoAcao: {
      padding: 8,
    },
    botaoAdicionar: {
      backgroundColor: cores.primaria,
      borderRadius: 28,
      width: 56,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      right: 16,
      bottom: 16,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    containerModal: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    conteudoModal: {
      backgroundColor: cores.cartao,
      margin: 20,
      borderRadius: 8,
      padding: 20,
    },
    tituloModal: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: cores.texto,
    },
    containerInput: {
      marginBottom: 16,
    },
    labelInput: {
      fontSize: 14,
      marginBottom: 8,
      color: cores.texto,
    },
    input: {
      backgroundColor: cores.fundo,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: 4,
      padding: 10,
      color: cores.texto,
    },
    picker: {
      backgroundColor: cores.fundo,
      borderRadius: 4,
    },
    containerBotoes: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 16,
    },
    botaoCancelar: {
      padding: 10,
      marginRight: 16,
    },
    textoBotaoCancelar: {
      color: cores.primaria,
      fontWeight: 'bold',
    },
    botaoSalvar: {
      backgroundColor: cores.primaria,
      borderRadius: 4,
      padding: 10,
      paddingHorizontal: 20,
    },
    textoBotaoSalvar: {
      color: 'white',
      fontWeight: 'bold',
    },
    containerVazio: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    textoVazio: {
      fontSize: 16,
      color: cores.texto,
      textAlign: 'center',
      marginBottom: 16,
    },
  })

  return (
    <View style={estilos.container}>
      <View style={estilos.containerAleatorio}>
        <Text style={estilos.textoAleatorio}>Gerar</Text>
        <TextInput
          style={estilos.inputAleatorio}
          value={quantidadeAleatoria}
          onChangeText={setQuantidadeAleatoria}
          keyboardType="number-pad"
          maxLength={2}
        />
        <Text style={estilos.textoAleatorio}>processos</Text>
        <TouchableOpacity style={estilos.botaoAleatorio} onPress={handleGerarAleatorios}>
          <Text style={estilos.textoBotaoAleatorio}>Gerar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={processos}
        keyExtractor={item => item.id}
        renderItem={renderItemProcesso}
        ListEmptyComponent={
          <View style={estilos.containerVazio}>
            <Text style={estilos.textoVazio}>
              Nenhum processo adicionado ainda.
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={estilos.botaoAdicionar} onPress={abrirModalAdicionar}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={estilos.containerModal}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={estilos.conteudoModal}>
              <Text style={estilos.tituloModal}>
                {processoEditando ? 'Editar Processo' : 'Novo Processo'}
              </Text>

              <View style={estilos.containerInput}>
                <Text style={estilos.labelInput}>Nome do Processo</Text>
                <TextInput
                  style={estilos.input}
                  value={nomeProcesso}
                  onChangeText={setNomeProcesso}
                  placeholder="Nome do processo"
                  placeholderTextColor={cores.texto + '80'}
                />
              </View>

              <View style={estilos.containerInput}>
                <Text style={estilos.labelInput}>Tipo de Processo</Text>
                <Picker
                  selectedValue={tipoProcesso}
                  onValueChange={value => setTipoProcesso(value)}
                  style={[estilos.picker, { color: cores.texto }]}
                  dropdownIconColor={cores.texto}
                >
                  <Picker.Item label="CPU-Bound" value="cpu" />
                  <Picker.Item label="I/O-Bound" value="io" />
                </Picker>
              </View>

              <View style={estilos.containerInput}>
                <Text style={estilos.labelInput}>Tempo de Chegada</Text>
                <TextInput
                  style={estilos.input}
                  value={tempoChegada}
                  onChangeText={setTempoChegada}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={cores.texto + '80'}
                />
              </View>

              <View style={estilos.containerInput}>
                <Text style={estilos.labelInput}>Tempo Total de Execução</Text>
                <TextInput
                  style={estilos.input}
                  value={tempoExecucaoTotal}
                  onChangeText={setTempoExecucaoTotal}
                  keyboardType="number-pad"
                  placeholder="15"
                  placeholderTextColor={cores.texto + '80'}
                />
              </View>

              {tipoProcesso === 'io' && (
                <View style={estilos.containerInput}>
                  <Text style={estilos.labelInput}>Duração do I/O</Text>
                  <TextInput
                    style={estilos.input}
                    value={tempoIO.toString()}
                    onChangeText={text => setTempoIO(Number(text))}
                    keyboardType="number-pad"
                    placeholder="2"
                    placeholderTextColor={cores.texto + '80'}
                  />
                </View>
              )}

              <View style={estilos.containerInput}>
                <Text style={estilos.labelInput}>Bilhetes de Loteria</Text>
                <TextInput
                  style={estilos.input}
                  value={bilhetes}
                  onChangeText={setBilhetes}
                  keyboardType="number-pad"
                  placeholder="10"
                  placeholderTextColor={cores.texto + '80'}
                />
              </View>

              <View style={estilos.containerBotoes}>
                <TouchableOpacity
                  style={estilos.botaoCancelar}
                  onPress={() => setModalVisivel(false)}
                >
                  <Text style={estilos.textoBotaoCancelar}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={estilos.botaoSalvar}
                  onPress={handleSalvarProcesso}
                >
                  <Text style={estilos.textoBotaoSalvar}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

export default TelaGerenciadorProcessos