# cic-lang

Implementação da linguagem cic. Este guia ajuda a configurar e executar programas `cic`.
Os tokens de retorno escolhidos foram o TK_END e TK_ID.

## Iniciando

### Pré-requisitos

- node: v21.7.1
- npm: v10.5.0
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

## Observações gerais

- Certifique-se de que todas as dependências foram instaladas com o comando `npm install` ou `yarn`;
- A pasta `inputs/` contém exemplos que foram utilizadas para a concepção e teste do autômato, sinta-se livre para utilizar outros arquivos;
- Ao executar o comando para rodar o autômato com o arquivo selecionado. Será criada uma pasta `outputs/` com os arquivos `.txt` necessários;
- Certifique-se de que o `.sh` possui as permissões necessárias para a execução e para criação da pasta em sua máquina;
- Todo o autômato foi concebido e testado em ambiente Linux.

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
├── inputs/                   # Inputs de código na linguagem "cic"
│   ├── tk_end.cic            # Arquivo simulando diversos TK_END
│   │
│   ├── tk_id.cic             # Arquivo simulando diversos TK_ID
│   │
│   └── tk_error.cic          # Arquivo simulando erro
│
├── outputs/                  # Outputs da execução do autômato
│   ├── error.txt             # Arquivo contendo possíveis erros
│   │
│   ├── token_list.txt        # Arquivo com a lista dos tokens identificados
│   │
│   └── token_usage.txt       # Arquivo com a lista do uso dos tokens ordenado
│
├── node_modules/             # Dependências do projeto
│
├── package.json              # Metadados e scripts do projeto
└── tsconfig.json             # Configuração do TypeScript

```
