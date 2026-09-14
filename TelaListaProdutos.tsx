import { useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard,
  Modal,
  Pressable,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';

export type Produto = {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  descricao: string;
  imagem: string;
  estoque: number;
};

export const produtosIniciais: Produto[] = [
  {
    id: 1,
    nome: 'Cadeira Confort Plus',
    preco: 349.9,
    categoria: 'Móveis',
    descricao: 'Cadeira ergonômica com apoio lombar, ideal para home office.',
    imagem: 'https://placehold.co/100x100',
    estoque: 12,
  },
  {
    id: 2,
    nome: 'Mesa para Escritório',
    preco: 589.0,
    categoria: 'Móveis',
    descricao: 'Mesa compacta com acabamento em madeira, cabe em espaços pequenos.',
    imagem: 'https://placehold.co/100x100',
    estoque: 8,
  },
  {
    id: 3,
    nome: 'Luminária de Mesa LED',
    preco: 79.9,
    categoria: 'Iluminação',
    descricao: 'Luminária LED com intensidade ajustável e braço flexível.',
    imagem: 'https://placehold.co/100x100',
    estoque: 25,
  },
  {
    id: 4,
    nome: 'Suporte para Notebook',
    preco: 129.9,
    categoria: 'Acessórios',
    descricao: 'Suporte ergonômico em alumínio, melhora a ventilação do notebook.',
    imagem: 'https://placehold.co/100x100',
    estoque: 15,
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Lista'> & {
  produtos: Produto[];
  onAdicionarProduto: (produto: Produto) => void;
};

function ProdutoItem({
  produto,
  onPress,
}: {
  produto: Produto;
  onPress: () => void;
}) {
  const [favorito, setFavorito] = useState(false);
  const [quantidade, setQuantidade] = useState(0);

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Image source={{ uri: produto.imagem }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.categoria}>{produto.categoria}</Text>
        <Text style={styles.preco}>R$ {produto.preco.toFixed(2)}</Text>
        <Text style={styles.estoque}>Estoque: {produto.estoque}</Text>
      </View>
      
      {/* Container de Botões Atualizado para Responsividade */}
      <View style={styles.containerBotoes}>
        <TouchableOpacity 
          style={styles.botaoAcao} 
          onPress={() => setFavorito(!favorito)}
        >
          <Text style={styles.textoBotaoAcao}>{favorito ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.botaoAcao} 
          onPress={() => setQuantidade(Math.max(0, quantidade - 1))}
        >
          <Text style={styles.textoBotaoAcao}>-</Text>
        </TouchableOpacity>
        
        <View style={styles.containerQtd}>
          <Text style={styles.textoQuantidade}>{quantidade}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.botaoAcao} 
          onPress={() => setQuantidade(quantidade + 1)}
        >
          <Text style={styles.textoBotaoAcao}>+</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function TelaListaProdutos({
  navigation,
  produtos,
  onAdicionarProduto,
}: Props) {
  const [busca, setBusca] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [erro, setErro] = useState('');
  const inputPrecoRef = useRef<TextInput>(null);
  const inputEstoqueRef = useRef<TextInput>(null);

  const produtosFiltrados = useMemo(
    () =>
      produtos.filter((item) =>
        item.nome.toLowerCase().includes(busca.toLowerCase())
      ),
    [produtos, busca]
  );

  function validarESalvar() {
    if (nome.trim() === '') {
      setErro('O nome não pode ficar vazio.');
      return;
    }

    const precoNumerico = Number(preco.trim().replace(',', '.'));
    if (preco.trim() === '' || isNaN(precoNumerico) || precoNumerico <= 0) {
      setErro('O preço precisa ser um número maior que zero (ex.: 89,90).');
      return;
    }

    const estoqueNumerico = Number(estoque.trim());
    if (
      estoque.trim() === '' ||
      isNaN(estoqueNumerico) ||
      !Number.isInteger(estoqueNumerico) ||
      estoqueNumerico < 1
    ) {
      setErro('O estoque precisa ser um número inteiro maior ou igual a 1.');
      return;
    }

    onAdicionarProduto({
      id: Date.now(),
      nome: nome.trim(),
      preco: precoNumerico,
      categoria: 'Cadastrado',
      descricao: 'Produto cadastrado pela equipe da loja.',
      imagem: 'https://placehold.co/100x100',
      estoque: estoqueNumerico,
    });

    setNome('');
    setPreco('');
    setEstoque('');
    setErro('');
    setModalVisivel(false);
    Keyboard.dismiss();
  }

  function fecharModal() {
    setModalVisivel(false);
    setErro('');
    Keyboard.dismiss();
  }

  return (
    <>
      <FlatList
        style={styles.container}
        data={produtosFiltrados}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <TouchableOpacity
              style={styles.botaoAbrir}
              onPress={() => setModalVisivel(true)}
            >
              <Text style={styles.botaoAbrirTexto}>+ Novo produto</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Buscar produto..."
              placeholderTextColor="#888888"
              value={busca}
              onChangeText={setBusca}
            />
          </View>
        }
        renderItem={({ item }) => (
          <ProdutoItem
            produto={item}
            onPress={() =>
              navigation.navigate('Detalhe', { produtoId: item.id })
            }
          />
        )}
      />

      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent
        onRequestClose={fecharModal}
      >
        <Pressable style={styles.modalOverlay} onPress={fecharModal}>
          <Pressable style={styles.modalConteudo} onPress={() => {}}>
            <Text style={styles.tituloForm}>Cadastrar produto</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do novo produto"
              placeholderTextColor="#888888"
              value={nome}
              onChangeText={setNome}
              returnKeyType="next"
              onSubmitEditing={() => inputPrecoRef.current?.focus()}
            />
            <TextInput
              ref={inputPrecoRef}
              style={styles.input}
              placeholder="Preço (ex.: 89,90)"
              placeholderTextColor="#888888"
              value={preco}
              onChangeText={setPreco}
              keyboardType="decimal-pad"
              returnKeyType="next"
              onSubmitEditing={() => inputEstoqueRef.current?.focus()}
            />
            <TextInput
              ref={inputEstoqueRef}
              style={styles.input}
              placeholder="Estoque (ex.: 10)"
              placeholderTextColor="#888888"
              value={estoque}
              onChangeText={setEstoque}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={validarESalvar}
            />
            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
            <TouchableOpacity style={styles.botao} onPress={validarESalvar}>
              <Text style={styles.botaoTexto}>Cadastrar produto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoCancelar} onPress={fecharModal}>
              <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cabecalho: {
    margin: 16,
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalConteudo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    gap: 8,
  },
  tituloForm: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  botaoAbrir: {
    backgroundColor: '#1B3A5C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  botaoAbrirTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  erro: {
    color: '#C62828',
    fontSize: 14,
  },
  botao: {
    backgroundColor: '#1B3A5C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  botaoCancelar: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  botaoCancelarTexto: {
    color: '#666666',
    fontWeight: '600',
    fontSize: 16,
  },
  
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', 
    marginBottom: 16,
    marginHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    minWidth: 150, 
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  categoria: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  preco: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
    marginTop: 4,
  },
  estoque: {
    fontSize: 13,
    color: '#333333',
    marginTop: 2,
  },
  containerBotoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8, 
  },
  botaoAcao: {
    minWidth: 44, 
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  textoBotaoAcao: {
    fontSize: 18,
    color: '#1B3A5C',
    fontWeight: 'bold',
  },
  containerQtd: {
    minWidth: 24,
    alignItems: 'center',
  },
  textoQuantidade: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  }
});