# HB Finance Mobile

Aplicativo mobile e web para controle financeiro pessoal, desenvolvido como
trabalho acadêmico do curso de Análise e Desenvolvimento de Sistemas da UVV.

O projeto permite que cada usuário registre e acompanhe suas receitas e
despesas de forma organizada. Os dados são armazenados no Supabase e protegidos
por autenticação e políticas de segurança por usuário.

## Objetivo acadêmico

Este trabalho demonstra a aplicação prática de conceitos de desenvolvimento de
software, incluindo:

- desenvolvimento de interfaces com React Native;
- criação de aplicações multiplataforma com Expo;
- autenticação de usuários;
- integração com banco de dados em nuvem;
- operações de criação, consulta, edição e exclusão de dados;
- controle de acesso com Row Level Security (RLS);
- organização de código em componentes, telas, serviços e contexto global.

## Funcionalidades

- Cadastro e login de usuários;
- Autenticação integrada ao Supabase Auth;
- Dashboard com receitas, despesas e saldo;
- Cadastro de lançamentos financeiros;
- Classificação por tipo e categoria;
- Edição e exclusão de lançamentos;
- Filtros de lançamentos;
- Relatórios financeiros por período;
- Comparação entre períodos;
- Isolamento dos dados entre usuários;
- Execução em Android e navegador.

## Tecnologias utilizadas

- React Native;
- Expo SDK 52;
- React Navigation;
- Supabase Auth;
- Supabase PostgreSQL;
- Row Level Security (RLS);
- JavaScript;
- Node.js e npm.

## Estrutura principal

```text
HBFinanceMobile/
├── assets/                 # Imagens e recursos visuais
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── context/            # Estado global financeiro
│   ├── navigation/         # Navegação e menu lateral
│   ├── screens/            # Telas do aplicativo
│   ├── services/           # Comunicação com o Supabase
│   └── utils/              # Formatação e regras auxiliares
├── supabase/
│   └── rls.sql             # Políticas de segurança do banco
├── App.js
├── app.json
└── package.json
```

## Configuração do banco

Execute o script [supabase/rls.sql](./supabase/rls.sql) no SQL Editor do
Supabase. Ele cria as tabelas `profiles`, `categories` e `transactions`,
insere as categorias padrão, migra categorias existentes e configura as
políticas RLS.

O Supabase Auth continua armazenando as credenciais no schema interno `auth`.
O aplicativo usa `category_id` em `transactions`, enquanto o nome da categoria
continua disponível para as telas por meio da relação com `categories`.

## Conta conjunta

O app permite adicionar um integrante já cadastrado pelo e-mail na tela
**Conta conjunta**. Os integrantes visualizam os lançamentos da mesma conta,
mas cada pessoa pode editar ou excluir somente os lançamentos que criou. Cada
lançamento também exibe o nome de quem o registrou.


## Segurança

O frontend usa apenas uma chave pública do Supabase. A proteção dos dados é
complementada por:

- autenticação pelo Supabase Auth;
- filtro pelo usuário autenticado;
- políticas RLS no PostgreSQL;
- regras de `.gitignore` para evitar publicação de arquivos sensíveis;
- ausência de chaves administrativas no código do aplicativo.

## Escopo do projeto

Este projeto foi desenvolvido para fins acadêmicos e de aprendizado. Ele não
substitui um sistema financeiro profissional e não deve ser utilizado como
única fonte para decisões financeiras reais sem uma revisão adicional de
segurança, disponibilidade, backup e conformidade.

## Autor

**Heitor Bailke de Bem**  
Curso de Análise e Desenvolvimento de Sistemas  
UVV
