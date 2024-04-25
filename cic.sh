#!/bin/bash

# Verifica se pelo menos um argumento foi fornecido
if [ "$#" -lt 1 ]; then
    echo "Uso: $0 <filename> [algorithm_type]"
    exit 1
fi

# Define 'lexer' como tipo de algoritmo padrão se não for fornecido
algorithm_type=${2:-lexer}

# Executa o script TypeScript com o arquivo e o tipo de algoritmo especificados
npx tsx src/app.ts $1 $algorithm_type
