// src/utils/pdf_parser.js
const fs = require('fs');
const pdf = require('pdf-parse');

async function extractTextFromPDF(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo não encontrado: ${filePath}`);
    }
    
    const dataBuffer = fs.readFileSync(filePath);
    
    // Armazena a função console.warn original
    const originalConsoleWarn = console.warn;

    // Supressão de warnings internos da biblioteca (para limpar o console)
    console.warn = (message, ...args) => {
        if (typeof message === 'string' && (
            message.includes('Ran out of space in font private use area') || 
            message.includes('Invalid cMap data')
        )) {
            return; 
        }
        originalConsoleWarn(message, ...args);
    };

    let textData;
    try {
        const data = await pdf(dataBuffer);
        textData = data.text;
    } catch (error) {
        console.error(`Erro ao processar PDF ${filePath}:`, error.message);
        throw error;
    } finally {
        // Restaura a função console.warn original
        console.warn = originalConsoleWarn;
    }
    
    return textData;
}

module.exports = extractTextFromPDF;