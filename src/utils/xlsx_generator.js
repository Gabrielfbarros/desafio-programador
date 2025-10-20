// src/utils/xlsx_generator.js
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

/**
 * Gera um arquivo XLSX a partir de um array de objetos.
 * @param {Array<Object>} data Array de objetos com os dados a serem exportados.
 * @param {string} outputFilePath Caminho completo onde o arquivo será salvo.
 */
function generateXLSX(data, outputFilePath) {
    if (!data || data.length === 0) {
        console.warn(`Aviso: Tentativa de gerar XLSX, mas os dados estão vazios para ${outputFilePath}.`);
        return;
    }

    // 1. Converte o array de objetos para uma Planilha (WorkSheet)
    const ws = XLSX.utils.json_to_sheet(data);

    // 2. Cria o Workbook (Arquivo)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados"); // Nome da aba é "Dados"

    // 3. Escreve o arquivo no disco
    try {
        XLSX.writeFile(wb, outputFilePath);
        console.log(`Sucesso: Arquivo XLSX gerado em ${outputFilePath}`);
    } catch (error) {
        console.error(`Erro ao escrever o arquivo XLSX ${outputFilePath}:`, error);
    }
}

module.exports = generateXLSX;