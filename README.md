# cic-lang

Este repositório contém a implementação de um analisador léxico em TypeScript. O analisador é capaz de processar código-fonte e identificar tokens conforme definido pela gramática da linguagem de programação. O lexer suporta identificação de palavras reservadas, operadores, delimitadores, identificadores, números inteiros e de ponto flutuante, cadeias de caracteres, entre outros.

## Funcionalidades

- **Reconhecimento de Tokens:** Capaz de diferenciar e classificar diversos tipos de tokens, incluindo palavras reservadas, operadores, delimitadores, números e identificadores.

- **Contagem de Uso de Tokens:** Mantém uma contagem de quantas vezes cada token é utilizado no código-fonte.

- **Tratamento de Erros:** Identifica e registra erros relacionados a tokens malformados ou não reconhecidos.

- **Suporte a Comentários:** Ignora comentários de linha única e de múltiplas linhas durante a análise.

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
│   │   ├── automaton.ts      # Autômato
│   │   │
│   │   ├── states.ts         # Mudanças de estado
│   │   │
│   │   └── lexer.ts          # Analisador léxico da linguagem
│   │
│   ├── utils/                # Utilitários gerais
│   │   ├── enums.ts          # Enumeradores
│   │   │
│   │   └── constants.ts      # Constantes globais
│   │
│   ├── types/                # Definições de tipos
│   │   └── types.ts          # Tipos específicos da linguagem
│   │
│   └── app.ts                # Ponto de entrada da aplicação
│
├── inputs/                   # Inputs de código na linguagem "cic"
│   └── ex1.cic               # Exemplo utilizado para construir o analisador
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

## Licença

O projeto é licenciado sob a MIT License.
