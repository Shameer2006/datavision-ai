// ============================================================
// Data profiler — parses CSV/Excel and generates column metadata
// Runs server-side in the API route (Node.js)
// ============================================================

import Papa from "papaparse";
import * as XLSX from "xlsx";

export type ColumnProfile = {
  name: string;
  dtype: "number" | "string" | "date" | "boolean" | "mixed";
  nulls: number;
  unique: number;
  sample: any[];
  min?: number;
  max?: number;
  mean?: number;
  topValues?: { value: string; count: number }[];
};

export type DataProfile = {
  filename: string;
  rows: number;
  columns: number;
  headers: ColumnProfile[];
  sampleRows: Record<string, any>[];
};

/**
 * Parse a file buffer (CSV or Excel) into an array of row objects.
 */
export function parseFile(
  buffer: Buffer,
  filename: string
): Record<string, any>[] {
  const ext = filename.toLowerCase().split(".").pop();

  if (ext === "csv") {
    const text = buffer.toString("utf-8");
    const result = Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });
    const rows = result.data as Record<string, any>[];
    // DEBUG: log parse result
    console.log(`[Profiler] CSV parsed: ${rows.length} rows, columns: ${result.meta?.fields?.join(", ") || "unknown"}`);
    return rows;
  }

  if (ext === "xlsx" || ext === "xls") {
    const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null }) as Record<string, any>[];
    // DEBUG: log parse result
    const cols = rows.length > 0 ? Object.keys(rows[0]).join(", ") : "none";
    console.log(`[Profiler] Excel parsed: ${rows.length} rows, columns: ${cols}`);
    return rows;
  }

  throw new Error(`Unsupported file type: .${ext}. Please upload CSV or Excel.`);
}

/**
 * Infer the data type of a column from its values.
 */
function inferColumnType(
  values: any[]
): "number" | "string" | "date" | "boolean" | "mixed" {
  const nonNull = values.filter(
    (v) => v !== null && v !== undefined && v !== ""
  );
  if (nonNull.length === 0) return "string";

  let numCount = 0;
  let dateCount = 0;
  let boolCount = 0;
  let strCount = 0;

  for (const v of nonNull.slice(0, 200)) {
    if (typeof v === "number" || (typeof v === "string" && !isNaN(Number(v)) && v.trim() !== "")) {
      numCount++;
    } else if (v instanceof Date || (typeof v === "string" && !isNaN(Date.parse(v)) && v.length > 6)) {
      dateCount++;
    } else if (typeof v === "boolean" || v === "true" || v === "false") {
      boolCount++;
    } else {
      strCount++;
    }
  }

  const total = nonNull.slice(0, 200).length;
  const threshold = 0.7;

  if (numCount / total >= threshold) return "number";
  if (dateCount / total >= threshold) return "date";
  if (boolCount / total >= threshold) return "boolean";
  if (strCount / total >= threshold) return "string";
  return "mixed";
}

/**
 * Generate a full profile of the dataset: column types, nulls, stats, etc.
 */
export function profileData(
  rows: Record<string, any>[],
  filename: string
): DataProfile {
  if (!rows.length) {
    return {
      filename,
      rows: 0,
      columns: 0,
      headers: [],
      sampleRows: [],
    };
  }

  // Collect headers from ALL rows to handle sparse/uneven data
  const headerSet = new Set<string>();
  for (const row of rows.slice(0, 10)) {
    Object.keys(row).forEach((k) => headerSet.add(k));
  }
  // Filter out empty/whitespace-only header names
  const headers = [...headerSet].filter((h) => h && String(h).trim() !== "");

  // DEBUG: show what profileData sees
  console.log(`[Profiler] profileData: ${rows.length} rows, ${headers.length} columns: [${headers.join(", ")}]`);

  const columnProfiles: ColumnProfile[] = headers.map((col) => {
    const values = rows.map((r) => r[col]);
    const dtype = inferColumnType(values);
    const nonNull = values.filter(
      (v) => v !== null && v !== undefined && v !== ""
    );
    const nulls = values.length - nonNull.length;
    const uniqueSet = new Set(nonNull.map(String));

    const profile: ColumnProfile = {
      name: col,
      dtype,
      nulls,
      unique: uniqueSet.size,
      sample: [...uniqueSet].slice(0, 5),
    };

    // Numeric stats
    if (dtype === "number") {
      const nums = nonNull.map(Number).filter((n) => !isNaN(n));
      if (nums.length > 0) {
        profile.min = Math.min(...nums);
        profile.max = Math.max(...nums);
        profile.mean = Math.round(
          (nums.reduce((a, b) => a + b, 0) / nums.length) * 100
        ) / 100;
      }
    }

    // Top values for categorical columns
    if (dtype === "string" && uniqueSet.size <= 50) {
      const counts: Record<string, number> = {};
      for (const v of nonNull) {
        const key = String(v);
        counts[key] = (counts[key] || 0) + 1;
      }
      profile.topValues = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([value, count]) => ({ value, count }));
    }

    return profile;
  });

  return {
    filename,
    rows: rows.length,
    columns: headers.length,
    headers: columnProfiles,
    sampleRows: rows.slice(0, 5),
  };
}

/**
 * Format the profile as a readable string for the Gemini prompt.
 */
export function formatProfileForPrompt(profile: DataProfile): string {
  let text = `Dataset: "${profile.filename}" — ${profile.rows} rows, ${profile.columns} columns\n\n`;
  text += `Columns:\n`;

  for (const col of profile.headers) {
    text += `  - "${col.name}" (${col.dtype})`;
    text += ` | ${col.nulls} nulls | ${col.unique} unique values`;
    if (col.dtype === "number" && col.min !== undefined) {
      text += ` | range: ${col.min} to ${col.max} | mean: ${col.mean}`;
    }
    if (col.topValues) {
      text += ` | top values: ${col.topValues.slice(0, 5).map((v) => `"${v.value}"(${v.count})`).join(", ")}`;
    } else if (col.sample.length > 0) {
      text += ` | sample: ${col.sample.slice(0, 3).map((v) => `"${v}"`).join(", ")}`;
    }
    text += `\n`;
  }

  text += `\nSample rows (first 3):\n`;
  for (const row of profile.sampleRows.slice(0, 3)) {
    text += `  ${JSON.stringify(row)}\n`;
  }

  return text;
}
