const test = require('node:test');
const assert = require('node:assert/strict');

test('formata valores monetários em reais', () => {
  const valor = 1234.5;
  assert.match(valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), /R\$\s?1\.234,50/);
});

test('calcula saldo como receitas menos despesas', () => {
  const movimentacoes = [
    { tipo: 'receita', valor: 2000 },
    { tipo: 'despesa', valor: 350 },
  ];
  const receitas = movimentacoes.filter((item) => item.tipo === 'receita').reduce((total, item) => total + item.valor, 0);
  const despesas = movimentacoes.filter((item) => item.tipo === 'despesa').reduce((total, item) => total + item.valor, 0);
  assert.equal(receitas - despesas, 1650);
});
