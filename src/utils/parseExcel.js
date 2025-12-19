import * as XLSX from 'xlsx';

/**
 * Parse an Excel file (first sheet) into an array of question objects.
 * Expected columns (case-insensitive): question / question_text / text / câu hỏi
 * Optional columns: time / time_limit_seconds (number or like '5m'), max_score / score, order / order_index
 */
export default function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        const mapped = rows.map((row) => {
          const obj = {
            question_text: '',
            time_limit_seconds: null,
            max_score: null,
            order_index: null,
          };

          for (const key of Object.keys(row)) {
            const value = row[key];
            const k = String(key).trim().toLowerCase();

            if (k.includes('question') || k.includes('câu') || k.includes('text')) {
              obj.question_text = value == null ? '' : String(value);
            } else if (k.includes('time')) {
              if (value === '' || value == null) continue;
              if (typeof value === 'number') {
                obj.time_limit_seconds = Number(value);
              } else {
                const s = String(value).trim();
                const m = s.match(/(\d+(?:\.\d+)?)/);
                if (m) {
                  const n = Number(m[1]);
                  if (s.toLowerCase().includes('m')) obj.time_limit_seconds = Math.round(n * 60);
                  else obj.time_limit_seconds = Math.round(n);
                }
              }
            } else if (k.includes('score') || k.includes('point') || k.includes('điểm')) {
              if (value === '' || value == null) continue;
              obj.max_score = Number(value);
            } else if (k.includes('order') || k.includes('index') || k.includes('thứ tự')) {
              if (value === '' || value == null) continue;
              obj.order_index = Number(value);
            }
          }

          // if no explicit question_text found, try first column
          if (!obj.question_text) {
            const firstVal = Object.values(row)[0];
            obj.question_text = firstVal == null ? '' : String(firstVal);
          }

          return obj;
        });

        resolve(mapped);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
