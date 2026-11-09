import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import CampoTexto from '../../components/CampoTexto';
import BotaoPrincipal from '../../components/BotaoPrincipal';
import { useFinance } from '../../context/FinanceContext';
import { validarEmail } from '../../utils/formatacao';
import styles from './styles';

const Cadastro = ({ onVoltarLogin }) => {
  const { registrarUsuario } = useFinance();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmacao: '' });
  const [erros, setErros] = useState({});
  const [erroCadastro, setErroCadastro] = useState('');
  const [sucessoCadastro, setSucessoCadastro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const alterar = (campo, valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    if (erroCadastro) setErroCadastro('');
  };

  const enviar = async () => {
    setErroCadastro('');
    setSucessoCadastro('');
    const novosErros = {};
    if (form.nome.trim().length < 3) novosErros.nome = 'Informe seu nome completo.';
    if (!validarEmail(form.email)) novosErros.email = 'Informe um e-mail válido.';
    if (form.senha.length < 6) novosErros.senha = 'A senha deve ter ao menos 6 caracteres.';
    if (form.senha !== form.confirmacao) novosErros.confirmacao = 'As senhas não coincidem.';
    setErros(novosErros);
    if (Object.keys(novosErros).length) return;
    setCarregando(true);
    try {
      const resultado = await registrarUsuario({ nome: form.nome.trim(), email: form.email.trim(), senha: form.senha });
      if (!resultado.session) {
        setSucessoCadastro('Conta criada, mas o Supabase ainda exige confirmação de e-mail. Desative “Confirm email” nas configurações de autenticação.');
      }
    } catch (error) {
      setErroCadastro(error.message || 'Não foi possível criar a conta. Verifique sua conexão e tente novamente.');
    } finally { setCarregando(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>HB</Text><Text style={styles.title}>HB Finance Mobile</Text>
        <Text style={styles.subtitle}>Organize sua vida financeira.</Text>
        <View style={styles.form}>
          <Text style={styles.heading}>Criar sua conta</Text>
          <CampoTexto label="Nome completo" value={form.nome} onChangeText={(value) => alterar('nome', value)} erro={erros.nome} placeholder="Seu nome" />
          <CampoTexto label="E-mail" value={form.email} onChangeText={(value) => alterar('email', value)} erro={erros.email} keyboardType="email-address" autoCapitalize="none" placeholder="voce@email.com" />
          <CampoTexto label="Senha" value={form.senha} onChangeText={(value) => alterar('senha', value)} erro={erros.senha} secureTextEntry placeholder="Mínimo de 6 caracteres" />
          <CampoTexto label="Confirme sua senha" value={form.confirmacao} onChangeText={(value) => alterar('confirmacao', value)} erro={erros.confirmacao} secureTextEntry placeholder="Repita sua senha" />
          {erroCadastro ? <Text accessibilityRole="alert" style={styles.erroCadastro}>{erroCadastro}</Text> : null}
          {sucessoCadastro ? <Text accessibilityRole="alert" style={styles.sucessoCadastro}>{sucessoCadastro}</Text> : null}
          <BotaoPrincipal title="Criar conta" onPress={enviar} loading={carregando} />
          <Text style={styles.loginRow}>Já possui uma conta? <Text onPress={onVoltarLogin} style={styles.loginLink}>Entrar</Text></Text>
          <Text style={styles.note}>Sua senha é protegida pelo Supabase Auth.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Cadastro;
