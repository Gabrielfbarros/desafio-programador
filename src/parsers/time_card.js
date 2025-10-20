// src/parsers/time_card.js
const extractTextFromPDF = require('../utils/pdf_parser');

async function parseTimeCard(filePath) {
    const fullText = await extractTextFromPDF(filePath);
    const lines = fullText.split('\n');
    const records = [];

    // Tenta encontrar o Mês/Ano (ex: "10/2011") no topo do PDF
    const monthYearMatch = fullText.match(/Mês\/Ano:[\r\n]?\s*(\d{2}\/\d{4})/);
    const referenceMonthYear = monthYearMatch ? monthYearMatch[1] : 'MM/YYYY';

    // Headers do arquivo XLSX/CSV de exemplo
    const XLSX_HEADERS = [
        'Data', 'Entrada1', 'Saída1', 'Entrada2', 'Saída2', 
        'Entrada3', 'Saída3', 'Entrada4', 'Saída4', 
        'Entrada5', 'Saída5', 'Entrada6', 'Saída6'
    ];

    for (const line of lines) {
        // Regex para capturar o dia e o dia da semana no início da linha (Ex: "03 SEG")
        const dayMatch = line.match(/^(\d{2})\s+([A-Z]{3})/); 
        
        if (dayMatch) {
            const day = dayMatch[1];
            const dateStr = `${day}/${referenceMonthYear}`;
            const timeRecord = { Data: dateStr };

            // Inicializa todas as colunas de ponto como vazias
            XLSX_HEADERS.slice(1).forEach(header => timeRecord[header] = ''); 

            // Se for dia de descanso ou abono, apenas registra a data e continua
            if (line.includes('Descanso Semanal') || line.includes('ABONO AUSENCIA')) {
                records.push(timeRecord);
                continue;
            }

            // Tenta extrair todos os padrões de 4 dígitos de hora (HH:MM) na linha
            // Isso captura entradas e saídas sequencialmente
            const timePunches = line.matchAll(/(\d{2}:\d{2})/g); 
            const punches = Array.from(timePunches).map(m => m[0]);
            
            // Mapeia os horários extraídos para as colunas do XLSX (E1/S1, E2/S2, etc.)
            for (let i = 0; i < 6; i++) { // Máximo de 6 pares (E1/S1 a E6/S6)
                const entryIndex = i * 2;
                const exitIndex = i * 2 + 1;
                
                // Coloca o horário ou string vazia (já inicializada)
                if (punches[entryIndex]) {
                    timeRecord[`Entrada${i + 1}`] = punches[entryIndex];
                }
                if (punches[exitIndex]) {
                    timeRecord[`Saída${i + 1}`] = punches[exitIndex];
                }
            }

            records.push(timeRecord);
        }
    }

    return records;
}

module.exports = parseTimeCard;