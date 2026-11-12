export const CORES = {
  marinho: '#0B172A',
  azul: '#2563EB',
  verde: '#0F766E',
  vermelho: '#B42318',
  cinza: '#F6F7F9',
  branco: '#FFFFFF',
  texto: '#142033',
  cinzaTexto: '#526176',
  borda: '#D8DEE8',
  verdeClaro: '#D9F3EE',
  vermelhoClaro: '#FEE4E2',
  amarelo: '#B45309',
  amareloClaro: '#FEF3C7',
};

export const CATEGORIAS = [
  'Todas',
  'Alimentação',
  'iFood',
  'Transporte',
    'Moradia',
  'Saúde',
  'Lazer',
  'Salário',
  'Outros',
];

export const ICONES_CATEGORIA = {
  Alimentação: '🍽️',
  iFood: '🛵',
  Transporte: '🚗',
  Moradia: '🏡',
  Saúde: '🏥',
  Lazer: '🏖️',
  Salário: '💰',
  Outros: '🗯️',
};

export const obterDataLocal = () => {
  const data = new Date();
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

export const formatarMoeda = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export const formatarData = (valor) => {
  if (!valor) return '-';
  const texto = String(valor);
  const correspondencia = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (correspondencia) return `${correspondencia[3]}/${correspondencia[2]}/${correspondencia[1]}`;
  return texto;
};

export const formatarDataDigitada = (valor) => {
  const digitos = String(valor || '').replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
};

export const converterDataParaIso = (valor) => {
  const correspondencia = String(valor || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!correspondencia) return '';
  const [, dia, mes, ano] = correspondencia;
  const data = new Date(Date.UTC(Number(ano), Number(mes) - 1, Number(dia)));
  if (data.getUTCFullYear() !== Number(ano) || data.getUTCMonth() !== Number(mes) - 1 || data.getUTCDate() !== Number(dia)) return '';
  return `${ano}-${mes}-${dia}`;
};

export const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
