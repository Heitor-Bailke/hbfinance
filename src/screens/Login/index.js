import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import BotaoPrincipal from '../../components/BotaoPrincipal';
import CampoTexto from '../../components/CampoTexto';
import { useFinance } from '../../context/FinanceContext';
import { validarEmail } from '../../utils/formatacao';
import styles from './styles';

const Login = ({ onCriarConta }) => {
  const { entrar } = useFinance();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erros, setErros] = useState({});
  const [erroLogin, setErroLogin] = useState('');
  const [carregando, setCarregando] = useState(false);
  const alterar = (campo, valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    if (erroLogin) setErroLogin('');
  };

  const enviar = async () => {
    setErroLogin('');
    const novosErros = {};
    if (!validarEmail(form.email)) novosErros.email = 'Informe um e-mail válido.';
    if (form.senha.length < 6) novosErros.senha = 'A senha deve ter ao menos 6 caracteres.';
    setErros(novosErros);
    if (Object.keys(novosErros).length) return;
    setCarregando(true);
    try {
      await entrar({ email: form.email, senha: form.senha });
    } catch (error) {
      setErroLogin(error.message || 'Não foi possível entrar. Verifique os dados e tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>HB</Text>
        <Text style={styles.title}>HB Finance Mobile</Text>
        <Text style={styles.subtitle}>Seu controle financeiro, simples e seguro.</Text>
        <View style={styles.form}>
          <Text style={styles.heading}>Acessar sua conta</Text>
          <Text style={styles.description}>Entre com o e-mail usado no cadastro.</Text>
          <CampoTexto label="E-mail" value={form.email} onChangeText={(value) => alterar('email', value)} erro={erros.email} keyboardType="email-address" autoCapitalize="none" placeholder="voce@email.com" />
          <CampoTexto label="Senha" value={form.senha} onChangeText={(value) => alterar('senha', value)} erro={erros.senha} secureTextEntry placeholder="Sua senha" />
          {erroLogin ? <Text accessibilityRole="alert" style={styles.erroLogin}>{erroLogin}</Text> : null}
          <BotaoPrincipal title="Entrar" onPress={enviar} loading={carregando} />
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Ainda não possui uma conta?</Text>
            <Pressable onPress={onCriarConta}><Text style={styles.registerLink}> Criar conta</Text></Pressable>
          </View>
          <Text style={styles.note}>Sua senha é protegida pelo Supabase Auth.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
