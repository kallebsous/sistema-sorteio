import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEscalonador, type Processo, type TipoProcesso } from '../contexto/ContextoEscalonador';
import { useTema } from '../contexto/ContextoTema';

const TelaGerenciadorProcessos = () => {
  const {
    processos,
    adicionarProcesso,
    atualizarProcesso,
    excluirProcesso,
    gerarProcessosAleatorios,
    tempoIO,
    setTempoIO,
  } = useEscalonador();
  
  const { cores } = useTema();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [processoEditando, setProcessoEditando] = useState<Processo | null>(null);
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: '',
    tipo: 'cpu' as TipoProcesso,
    tempoChegada: '',
    tempoExecucaoTotal: '',
    bilhetes: '',
  });
  const [quantidadeAleatoria, setQuantidadeAleatoria] = useState('5');

  const abrirModalEdicao = (processo?: Processo) => {
    if (processo) {
      setProcessoEditando(processo);
      setDadosFormulario({
        nome: processo.nome,
        tipo: processo.tipo,
        tempoChegada: processo.tempoChegada.toString(),
        tempoExecucaoTotal: processo.tempoExecucaoTotal.toString(),
        bilhetes: processo.bilhetes.toString(),
      });
    } else {
      setDadosFormulario({
        nome: '',
        tipo: 'cpu',
        tempoChegada: '',
        tempoExecucaoTotal: '',
        bilhetes: '',
      });
    }
    setModalVisivel(true);
  };

  const validarNumero = (valor: string, campo: string, min: number, max: number): boolean => {
    const numero = Number(valor);
    if (isNaN(numero)) {
      Alert.alert('Erro', `${campo} deve ser um número válido`);
      return false;
    }
    if (numero < min || numero > max) {
      Alert.alert('Erro', `${campo} deve estar entre ${min} e ${max}`);
      return false;
    }
    return true;
  };

  const handleSalvarProcesso = () => {
    if (!dadosFormulario.nome.trim()) {
      Alert.alert('Erro', 'Nome do processo é obrigatório');
      return;
    }

    const camposParaValidar = [
      { nome: 'Tempo de Chegada', valor: dadosFormulario.tempoChegada, min: 0, max: 100 },
      { nome: 'Tempo de Execução', valor: dadosFormulario.tempoExecucaoTotal, min: 1, max: 100 },
      { nome: 'Bilhetes', valor: dadosFormulario.bilhetes, min: 1, max: 100 },
    ];

    for (const campo of camposParaValidar) {
      if (!validarNumero(campo.valor, campo.nome, campo.min, campo.max)) return;
    }

    const novoProcesso = {
      nome: dadosFormulario.nome.trim(),
      tipo: dadosFormulario.tipo,
      tempoChegada: Number(dadosFormulario.tempoChegada),
      tempoExecucaoTotal: Number(dadosFormulario.tempoExecucaoTotal),
      bilhetes: Number(dadosFormulario.bilhetes),
    };

    if (processoEditando) {
      atualizarProcesso({ ...processoEditando, ...novoProcesso });
    } else {
      adicionarProcesso(novoProcesso);
    }

    setModalVisivel(false);
    setProcessoEditando(null);
  };

  const handleGerarAleatorios = () => {
    const quantidade = Number(quantidadeAleatoria);
    if (isNaN(quantidade) || quantidade < 1 || quantidade > 15) {
      Alert.alert('Erro', 'Digite um número entre 1 e 15');
      return;
    }
    gerarProcessosAleatorios(quantidade);
  };

  const renderizarItemProcesso = ({ item }: { item: Processo }) => (
    <View style={[estilos.itemProcesso, { backgroundColor: cores.cartao }]}>
      <View style={[estilos.marcadorCor, { backgroundColor: item.cor }]} />
      <View style={estilos.infoProcesso}>
        <View style={estilos.cabecalhoProcesso}>
          <Text style={[estilos.nomeProcesso, { color: cores.texto }]}>{item.nome}</Text>
          <View style={[
            estilos.badgeTipo,
            { backgroundColor: item.tipo === 'cpu' ? cores.primaria : cores.secundaria }
          ]}>
            <Text style={estilos.textoTipo}>{item.tipo.toUpperCase()}</Text>
          </View>
        </View>

        <View style={estilos.detalhesProcesso}>
          <Text style={[estilos.textoDetalhe, { color: cores.texto }]}>
            🕒 Chegada: {item.tempoChegada} | ⚡ Execução: {item.tempoExecucaoTotal}
          </Text>
          <Text style={[estilos.textoDetalhe, { color: cores.texto }]}>
            🎫 Bilhetes: {item.bilhetes}
          </Text>
          
          {item.tipo === 'io' && (
            <View style={estilos.detalhesIO}>
              <Text style={[estilos.textoDetalhe, { color: cores.texto }]}>
                ⚡ CPU Bursts: {item.cpuBursts.join(', ')}
              </Text>
              <Text style={[estilos.textoDetalhe, { color: cores.texto }]}>
                📥 I/O Bursts: {item.ioBursts.join(', ')}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={estilos.acoesProcesso}>
        <TouchableOpacity
          onPress={() => abrirModalEdicao(item)}
          style={estilos.botaoAcao}>
          <Ionicons name="pencil" size={20} color={cores.primaria} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => excluirProcesso(item.id)}
          style={estilos.botaoAcao}>
          <Ionicons name="trash" size={20} color={cores.erro} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[estilos.container, { backgroundColor: cores.fundo }]}>
      <View style={estilos.controleSuperior}>
        <View style={estilos.geracaoAleatoria}>
          <TextInput
            style={[estilos.inputQuantidade, { backgroundColor: cores.fundo, color: cores.texto }]}
            value={quantidadeAleatoria}
            onChangeText={setQuantidadeAleatoria}
            keyboardType="number-pad"
            placeholder="Qtd"
            maxLength={2}
          />
          <TouchableOpacity
            style={[estilos.botaoGerar, { backgroundColor: cores.primaria }]}
            onPress={handleGerarAleatorios}>
            <Text style={estilos.textoBotaoGerar}>Gerar Processos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={processos}
        keyExtractor={(item) => item.id}
        renderItem={renderizarItemProcesso}
        ListEmptyComponent={
          <View style={estilos.listaVazia}>
            <Text style={[estilos.textoListaVazia, { color: cores.texto }]}>
              Nenhum processo cadastrado
            </Text>
          </View>
        }
        contentContainerStyle={estilos.listaConteudo}
      />

      <TouchableOpacity
        style={[estilos.botaoFlutuante, { backgroundColor: cores.primaria }]}
        onPress={() => abrirModalEdicao()}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisivel(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={estilos.modalContainer}>
          <ScrollView contentContainerStyle={estilos.modalConteudo}>
            <Text style={[estilos.tituloModal, { color: cores.texto }]}>
              {processoEditando ? 'Editar Processo' : 'Novo Processo'}
            </Text>

            <TextInput
              style={[estilos.input, { backgroundColor: cores.fundo, color: cores.texto }]}
              placeholder="Nome do processo"
              placeholderTextColor={cores.texto + '80'}
              value={dadosFormulario.nome}
              onChangeText={(text) => setDadosFormulario(prev => ({ ...prev, nome: text }))}
            />

            <View style={[estilos.pickerContainer, { backgroundColor: cores.fundo }]}>
              <Picker
                selectedValue={dadosFormulario.tipo}
                onValueChange={(value) => setDadosFormulario(prev => ({ ...prev, tipo: value }))}
                dropdownIconColor={cores.texto}>
                <Picker.Item label="CPU-Bound" value="cpu" />
                <Picker.Item label="I/O-Bound" value="io" />
              </Picker>
            </View>

            <TextInput
              style={[estilos.input, { backgroundColor: cores.fundo, color: cores.texto }]}
              placeholder="Tempo de chegada"
              placeholderTextColor={cores.texto + '80'}
              keyboardType="number-pad"
              value={dadosFormulario.tempoChegada}
              onChangeText={(text) => setDadosFormulario(prev => ({ ...prev, tempoChegada: text }))}
            />

            <TextInput
              style={[estilos.input, { backgroundColor: cores.fundo, color: cores.texto }]}
              placeholder="Tempo total de execução"
              placeholderTextColor={cores.texto + '80'}
              keyboardType="number-pad"
              value={dadosFormulario.tempoExecucaoTotal}
              onChangeText={(text) => setDadosFormulario(prev => ({ ...prev, tempoExecucaoTotal: text }))}
            />

            {dadosFormulario.tipo === 'io' && (
              <TextInput
                style={[estilos.input, { backgroundColor: cores.fundo, color: cores.texto }]}
                placeholder="Duração do I/O"
                placeholderTextColor={cores.texto + '80'}
                keyboardType="number-pad"
                value={tempoIO.toString()}
                onChangeText={(text) => setTempoIO(Number(text))}
              />
            )}

            <TextInput
              style={[estilos.input, { backgroundColor: cores.fundo, color: cores.texto }]}
              placeholder="Quantidade de bilhetes"
              placeholderTextColor={cores.texto + '80'}
              keyboardType="number-pad"
              value={dadosFormulario.bilhetes}
              onChangeText={(text) => setDadosFormulario(prev => ({ ...prev, bilhetes: text }))}
            />

            <View style={estilos.botoesModal}>
              <TouchableOpacity
                style={[estilos.botaoModal, { borderColor: cores.primaria }]}
                onPress={() => setModalVisivel(false)}>
                <Text style={[estilos.textoBotaoModal, { color: cores.primaria }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[estilos.botaoModal, { backgroundColor: cores.primaria }]}
                onPress={handleSalvarProcesso}>
                <Text style={[estilos.textoBotaoModal, { color: 'white' }]}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  controleSuperior: {
    marginBottom: 16,
  },
  geracaoAleatoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputQuantidade: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  botaoGerar: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  textoBotaoGerar: {
    color: 'white',
    fontWeight: 'bold',
  },
  listaConteudo: {
    flexGrow: 1,
  },
  listaVazia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textoListaVazia: {
    fontSize: 16,
    textAlign: 'center',
  },
  itemProcesso: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  marcadorCor: {
    width: 10,
  },
  infoProcesso: {
    flex: 1,
    padding: 16,
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
  badgeTipo: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  textoTipo: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detalhesProcesso: {
    gap: 4,
  },
  textoDetalhe: {
    fontSize: 14,
  },
  detalhesIO: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  acoesProcesso: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 12,
  },
  botaoAcao: {
    padding: 8,
  },
  botaoFlutuante: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalConteudo: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 24,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    borderRadius: 8,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  botaoModal: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
  },
  textoBotaoModal: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TelaGerenciadorProcessos;