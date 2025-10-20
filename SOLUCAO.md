# Solução Técnica - Parser de Cartão de Ponto

Este documento detalha o desenvolvimento do parser em Node.js focado na extração do Cartão de Ponto.

## 1. Estrutura e Ferramentas

O projeto foi estruturado em Node.js, utilizando o `pdf-parse` para extração do texto e o `xlsx` para a conversão final para a planilha.

* **`index.js`**: Orquestrador principal.
* **`src/utils/pdf_parser.js`**: Encapsula a lógica de extração do PDF, incluindo a supressão de avisos (`Warning: Ran out of space...`) para manter o console limpo.
* **`src/utils/xlsx_generator.js`**: Implementa a função de escrita do arquivo XLSX, convertendo o array de objetos JSON para o formato binário da planilha.
* **`src/parsers/time_card.js`**: Contém a lógica de parsing específica para o formato do Cartão de Ponto.

## 2. Desafios e Decisões Técnicas (Cartão de Ponto)

O principal desafio na extração do Cartão de Ponto reside na inconsistência com que o `pdf-parse` retorna o texto do PDF, especialmente a união de colunas.

### A. Extração de Datas e Referência

A data é construída capturando o **Mês/Ano** do cabeçalho (`/Mês\/Ano:\s*(\d{2}\/\d{4})/`) e combinando com o **Dia** (`^(\d{2})\s+([A-Z]{3})`) encontrado no início de cada linha de ponto.

### B. Mapeamento dos Horários (O ponto crítico)

O PDF junta Entradas e Saídas na mesma string (`09:50-13:45 14:00-16:06`). A solução adotada foi:
1.  Utilizar a expressão regular `(\d{2}:\d{2})` para extrair **todos** os horários HH:MM da linha.
2.  Mapear os horários extraídos sequencialmente:
    * Primeiro horário $\rightarrow$ `Entrada1`
    * Segundo horário $\rightarrow$ `Saída1`
    * Terceiro horário $\rightarrow$ `Entrada2`
    * Quarto horário $\rightarrow$ `Saída2`
    * E assim por diante, até o máximo de 6 pares.

### C. Tratamento de Ausências

Linhas contendo `"Descanso Semanal"` ou `"ABONO AUSENCIA"` são identificadas, e a lógica garante que apenas a coluna `Data` seja preenchida, deixando todas as colunas de ponto vazias, conforme o modelo esperado.

## 3. Próximos Passos (Holerite)

A implementação do Holerite (não incluída nesta entrega) exigiria um esforço significativamente maior, focado em:
1.  **Regex Multicoluna:** Criar uma Regex robusta para lidar com as 6 colunas de `Código`, `Descrição`, `Qtde Provento`, `Valor Provento`, `Qtde Desconto`, `Valor Desconto`.
2.  **Estrutura Achatada (Flattening):** Implementar uma lógica de "whitelist" para mapear os itens extraídos (Ex: código 4020) para colunas específicas do XLSX de saída (`(4020) Farmacia VALOR`), ignorando as colunas `REFERENCIA`/`QUANTIDADE` para a maioria dos itens.