export type CsvRow = Record<string, string>;

function normalizeCell(value: string) {
  return value.replace(/\r/g, "").trim();
}

function detectDelimiter(text: string) {
  const firstDataLine = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .find((line) => line.trim().length > 0);

  if (!firstDataLine) return ",";

  const commaCount = (firstDataLine.match(/,/g) || []).length;
  const semicolonCount = (firstDataLine.match(/;/g) || []).length;
  const tabCount = (firstDataLine.match(/\t/g) || []).length;

  if (semicolonCount > commaCount && semicolonCount >= tabCount) return ";";
  if (tabCount > commaCount && tabCount > semicolonCount) return "\t";
  return ",";
}

export function parseCsv(text: string, delimiter?: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  const input = text.replace(/^\uFEFF/, "");
  const activeDelimiter = delimiter || detectDelimiter(text);

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === activeDelimiter) {
      row.push(normalizeCell(cell));
      cell = "";
      continue;
    }

    if (!inQuotes && char === "\n") {
      row.push(normalizeCell(cell));
      cell = "";
      if (row.some((item) => item.length > 0)) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(normalizeCell(cell));
    if (row.some((item) => item.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
}

export function csvToObjects(text: string): CsvRow[] {
  const rows = parseCsv(text);
  if (!rows.length) return [];

  const headers = rows[0].map((item) => item.trim());
  const dataRows = rows.slice(1);

  return dataRows
    .map((cells) => {
      const record: CsvRow = {};
      headers.forEach((header, index) => {
        if (!header) return;
        record[header] = (cells[index] || "").trim();
      });
      return record;
    })
    .filter((row) => Object.values(row).some(Boolean));
}
