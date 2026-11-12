import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import CardMovimentacao from '../../components/CardMovimentacao';
import { useFinance } from '../../context/FinanceContext';
import { CATEGORIAS, CORES, ICONES_CATEGORIA } from '../../utils/formatacao';
import styles from './styles';

const Lancamentos = ({ navigation }) => {
  const { movimentacoes, removerMovimentacao } = useFinance();
  const [tipo, setTipo] = useState('todos');
  const [categoria, setCategoria] = useState('Todas');
  const [categoriaAberta, setCategoriaAberta] = useState(false);
  const filtradas = useMemo(() => movimentacoes.filter((item) => (tipo === 'todos' || item.tipo === tipo) && (categoria === 'Todas' || item.categoria === categoria)), [movimentacoes, tipo, categoria]);
  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.intro}>
          <View style={styles.introIcon}><Text style={styles.introIconText}>≡</Text></View>
          <View><Text style={styles.title}>Lançamentos</Text><Text style={styles.subtitle}>Consulte e filtre suas movimentações</Text></View>
        </View>
        <View style={styles.filters}>
          <Text style={styles.label}>Tipo de lançamento</Text>
          <View style={styles.typeSelector}>
            <Pressable onPress={() => setTipo('todos')} style={[styles.typeOption, tipo === 'todos' && styles.typeOptionSelected]}><Text style={[styles.typeOptionText, tipo === 'todos' && styles.selectedTypeText]}>Todos</Text></Pressable>
            <Pressable onPress={() => setTipo('receita')} style={[styles.typeOption, tipo === 'receita' && styles.incomeOptionSelected]}><Text style={styles.typeOptionText}>Receitas</Text></Pressable>
            <Pressable onPress={() => setTipo('despesa')} style={[styles.typeOption, tipo === 'despesa' && styles.expenseOptionSelected]}><Text style={styles.typeOptionText}>Gastos</Text></Pressable>
          </View>
          <Text style={styles.label}>Categoria</Text>
          <Pressable onPress={() => setCategoriaAberta((aberta) => !aberta)} style={[styles.categorySelect, categoriaAberta && styles.categorySelectOpen]}>
            <View style={styles.categorySelectedIcon}><Text style={styles.categoryIconText}>{categoria === 'Todas' ? '•' : ICONES_CATEGORIA[categoria]}</Text></View>
            <Text style={styles.categorySelectedText}>{categoria}</Text>
            <Text style={styles.categoryChevron}>{categoriaAberta ? '⌃' : '⌄'}</Text>
          </Pressable>
          {categoriaAberta ? <View style={styles.categoryGrid}>{CATEGORIAS.map((item) => <Pressable key={item} onPress={() => { setCategoria(item); setCategoriaAberta(false); }} style={[styles.categoryOption, categoria === item && styles.categoryOptionSelected]}><View style={[styles.categoryOptionIcon, categoria === item && styles.categoryOptionIconSelected]}><Text style={styles.categoryIconText}>{item === 'Todas' ? '•' : ICONES_CATEGORIA[item]}</Text></View><Text style={[styles.categoryOptionText, categoria === item && styles.categoryOptionTextSelected]}>{item}</Text></Pressable>)}</View> : null}
        </View>
      </View>
      <FlatList data={filtradas} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => <View><CardMovimentacao movimentacao={item} /><View style={styles.itemActions}><Pressable accessibilityRole="button" onPress={() => navigation.navigate('NovoLancamento', { movimentacao: item })} style={styles.actionButton}><Text style={styles.actionText}>Editar</Text></Pressable><Pressable accessibilityRole="button" onPress={() => Alert.alert('Excluir lançamento', 'Deseja excluir este lançamento?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Excluir', style: 'destructive', onPress: async () => { try { await removerMovimentacao(item.id); } catch (error) { Alert.alert('Erro', error.message); } } }])} style={styles.actionButton}><Text style={styles.deleteText}>Excluir</Text></Pressable></View></View>} ListEmptyComponent={<Text style={styles.empty}>Nenhum lançamento encontrado para esses filtros.</Text>} contentContainerStyle={filtradas.length ? undefined : styles.emptyList} />
    </View>
  );
};

export default Lancamentos;
