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
  const data = new Date(`${valor}T12:00:00`);
  return Number.isNaN(data.getTime()) ? valor : data.toLocaleDateString('pt-BR');
};

export const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
