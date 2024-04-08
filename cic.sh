#!/bin/bash

# Verifica se um argumento de linha de comando foi fornecido
if [ "$#" -ne 1 ]; then
    echo "use: $0 <nome_do_arquivo>"
    exit 1
fi

# Executa o script TypeScript com o arquivo especificado
npx tsx src/app.ts $1
