// desafio-programador/index.js

const fs = require('fs');
const path = require('path');

// Importa os módulos
const parseTimeCard = require('./src/parsers/time_card');
const generateXLSX = require('./src/utils/xlsx_generator');

// --- Configurações de Diretórios e Arquivos ---
const DATA_DIR = path.join(__dirname, 'data');
const OUTPUT_DIR = path.join(__dirname, 'output'); 
const FILE_TIME_CARD = 'Exemplo-Cartao-Ponto-01.pdf';


/**
 * Função principal que executa o fluxo de trabalho.
 */
async function run() {
    console.log("Iniciando o processamento do Cartão de Ponto...");

    // 1. Cria o diretório de saída se não existir
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    // --- 2. Processamento do Cartão de Ponto ---
    try {
        const timeCardPdfPath = path.join(DATA_DIR, FILE_TIME_CARD);
        
        if (fs.existsSync(timeCardPdfPath)) {
            console.log(`\nProcessando Cartão de Ponto: ${FILE_TIME_CARD}`);
            
            // 2a. Extrai e formata os dados
            const timeCardData = await parseTimeCard(timeCardPdfPath);
            
            // 2b. Gera o arquivo XLSX
            if (timeCardData && timeCardData.length > 0) {
                 generateXLSX(timeCardData, path.join(OUTPUT_DIR, 'Cartao-Ponto-Final.xlsx'));
            } else {
                 console.warn("Aviso: Nenhum dado de Cartão de Ponto extraído.");
            }
        } else {
             console.error(`\nERRO: Arquivo PDF de Cartão de Ponto não encontrado em ${timeCardPdfPath}`);
             console.error("Por favor, verifique se 'Exemplo-Cartao-Ponto-01.pdf' está na pasta 'data'.");
        }
    } catch (error) {
        console.error(`\nErro Crítico ao processar Cartão de Ponto:`, error);
    }
    
    console.log("\n✅ Processamento concluído.");
}

run().catch(error => {
    console.error("\n--- ERRO CRÍTICO NO FLUXO DE EXECUÇÃO ---");
    console.error(error);
    process.exit(1);
});