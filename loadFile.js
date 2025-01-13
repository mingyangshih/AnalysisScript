import xlsx from 'xlsx'

export function loadFile(file, index) {
    const workbook = xlsx.readFile(file);
    let workbook_sheet = workbook.SheetNames;                
    let workbook_response = xlsx.utils.sheet_to_json(        
        workbook.Sheets[workbook_sheet[index]]
    );
    return {workbook, workbook_response};
}