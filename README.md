# cic-lang

Implementação da linguagem cic, uma DSL para [inserir propósito]. Este guia ajuda a configurar e executar programas `cic`.

## Iniciando

### Pré-requisitos

- Node.js
- npm
- tsx (`npm install -g tsx`)

### Instalação

Clone o repositório.

```bash
git clone git@github.com:adrielfabricio/cic-lang.git
cd cic-lang
```

Instale as dependências

```bash
npm install
# ou
yarn
```

### Preparando o ambiente

Dê permissão de execução ao script `cic.sh`

```bash
chmod +x cic.sh
```

### Executando

Execute seu programa `cic` com:

```bash
./cic.sh <filename>.cic
```

## Estrutura do projeto

```schema
cic-lang/
│
├── src/                      # Código fonte do projeto
│   ├── core/                 # Núcleo da implementação da linguagem
│   │   ├── automaton.ts      # Autômato para análise sintática
│   │   └── states.ts         # Estados utilizados pelo autômato
│   │
│   ├── utils/                # Utilitários gerais
│   │   └── constants.ts      # Constantes globais
│   │
│   ├── types/                # Definições de tipos
│   │   └── types.ts          # Tipos específicos da linguagem
│   │
│   └── app.ts                # Ponto de entrada da aplicação
│
├── inputs/                 # Inputs de código na linguagem "cic"
│   └── tk_end.cic
│
├── node_modules/             # Dependências do projeto
│
├── package.json              # Metadados e scripts do projeto
└── tsconfig.json             # Configuração do TypeScript

```
