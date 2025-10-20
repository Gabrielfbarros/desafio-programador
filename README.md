# Desafio Programador - Extração de Dados de PDFs

Projeto desenvolvido como parte de um processo seletivo para demonstrar a capacidade de extrair dados estruturados de arquivos PDF e transformá-los em um formato XLSX padronizado.

## Requisitos

- Node.js (versão 18+)
- npm (Node Package Manager)

## Bibliotecas Utilizadas

| Biblioteca | Propósito |
| :--- | :--- |
| `pdf-parse` | Responsável por ler o PDF e extrair o texto em formato *raw*. |
| `xlsx` | Responsável por criar e escrever o arquivo final no formato XLSX. |

## Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://www.youtube.com/watch?v=xtwls2XmJUI](https://www.youtube.com/watch?v=xtwls2XmJUI)
    cd [pasta do projeto]
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Prepare os dados:**
    * Crie o diretório `data/` na raiz do projeto.
    * Coloque o arquivo de Cartão de Ponto (`Exemplo-Cartao-Ponto-01.pdf`) dentro da pasta `data/`.

4.  **Execute o script:**
    ```bash
    npm start
    ```

## Resultado

Após a execução, os arquivos XLSX gerados estarão disponíveis no diretório `output/`:

* `output/Cartao-Ponto-Final.xlsx`: Contém os dados de ponto mapeados para as colunas: Data, Entrada1, Saída1, Entrada2, Saída2, etc.

---