import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export function csvToJson(csvText: string): string {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return "[]";
  const headers = parseCsvLine(lines[0]);
  const result = lines.slice(1).map((line) => {
    const vals = parseCsvLine(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = vals[i] || ""; });
    return obj;
  });
  return JSON.stringify(result, null, 2);
}

export function jsonToCsv(jsonText: string): string {
  const data = JSON.parse(jsonText);
  if (!Array.isArray(data) || data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const lines = [
    headers.join(","),
    ...data.map((row: Record<string, unknown>) =>
      headers.map((h) => escapeCsv(String(row[h] ?? ""))).join(","),
    ),
  ];
  return lines.join("\n");
}

export function xmlToJson(xmlText: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  return JSON.stringify(xmlNodeToObj(doc.documentElement), null, 2);
}

export function jsonToXml(jsonText: string): string {
  const data = JSON.parse(jsonText);
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + objToXml(data, "root");
}

export function csvToExcel(csvText: string, filename = "converted.xlsx"): void {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(
    csvText.trim().split("\n").map((line) => parseCsvLine(line)),
  );
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([out], { type: "application/octet-stream" }), filename);
}

export async function excelToCsv(file: File): Promise<string> {
  const data = new Uint8Array(await file.arrayBuffer());
  const wb = XLSX.read(data, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_csv(ws);
}

export function xmlToCsv(xmlText: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const root = doc.documentElement;
  const rows = Array.from(root.children);
  if (rows.length === 0) return "";

  const allKeys = new Set<string>();
  const data: Record<string, string>[] = [];
  for (const row of rows) {
    const obj: Record<string, string> = {};
    for (const child of Array.from(row.children)) {
      const key = child.tagName;
      obj[key] = child.textContent?.trim() || "";
      allKeys.add(key);
    }
    if (row.children.length === 0 && row.textContent?.trim()) {
      obj["value"] = row.textContent.trim();
      allKeys.add("value");
    }
    data.push(obj);
  }
  const headers = Array.from(allKeys);
  const lines = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => escapeCsv(row[h] || "")).join(",")),
  ];
  return lines.join("\n");
}

export function downloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename);
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function escapeCsv(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function xmlNodeToObj(node: Element): unknown {
  const obj: Record<string, unknown> = {};
  if (node.attributes.length > 0) {
    for (let i = 0; i < node.attributes.length; i++) {
      obj["@" + node.attributes[i].name] = node.attributes[i].value;
    }
  }
  const children = Array.from(node.children);
  if (children.length === 0) {
    const text = node.textContent?.trim();
    if (text && Object.keys(obj).length === 0) return text;
    if (text) obj["#text"] = text;
    return Object.keys(obj).length > 0 ? obj : text || "";
  }
  for (const child of children) {
    const key = child.tagName;
    const value = xmlNodeToObj(child);
    if (obj[key]) {
      if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
      (obj[key] as unknown[]).push(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

function objToXml(obj: unknown, tag: string): string {
  if (obj === null || obj === undefined) return `<${tag}/>`;
  if (typeof obj !== "object") return `<${tag}>${escapeXml(String(obj))}</${tag}>`;
  if (Array.isArray(obj)) return obj.map((item) => objToXml(item, tag)).join("\n");

  const entries = Object.entries(obj as Record<string, unknown>);
  const attrs = entries.filter(([k]) => k.startsWith("@")).map(([k, v]) => ` ${k.slice(1)}="${escapeXml(String(v))}"`).join("");
  const children = entries.filter(([k]) => !k.startsWith("@"));

  if (children.length === 0) return `<${tag}${attrs}/>`;

  const inner = children.map(([k, v]) => {
    if (k === "#text") return escapeXml(String(v));
    return objToXml(v, k);
  }).join("\n");

  return `<${tag}${attrs}>\n${inner}\n</${tag}>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
