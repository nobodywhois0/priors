import type { Project } from "../data/projects";

export type BoardKind = "confirmed" | "weak" | "pending" | "rejected" | "moredata";

export interface BoardRow {
  hipotesis: string;
  estado: string;
  nivel: string;
  evidencia: string;
  proximoPaso: string;
  kind: BoardKind;
  shortLabel: string;
}

const SHORT_LABELS: Record<BoardKind, string> = {
  confirmed: "Confirmada",
  weak: "Evidencia débil",
  pending: "Pendiente",
  rejected: "Rechazada",
  moredata: "Requiere más datos",
};

export interface BoardResult {
  project: Project;
  rows: BoardRow[];
  error: string | null;
}

function stripMd(s: string): string {
  return s.replace(/\*\*/g, "").trim();
}

function classify(estado: string): BoardRow["kind"] {
  const s = estado.toLowerCase();
  if (s.includes("confirmada")) return "confirmed";
  if (s.includes("rechazada")) return "rejected";
  if (s.includes("pendiente")) return "pending";
  if (s.includes("evidencia débil") || s.includes("requiere más datos")) return "weak";
  return "moredata";
}

function parseBoardTable(markdown: string): BoardRow[] {
  const lines = markdown.split("\n");
  const tableLines: string[] = [];
  let inTable = false;
  for (const line of lines) {
    const isTableLine = /^\s*\|/.test(line);
    if (isTableLine) {
      inTable = true;
      tableLines.push(line);
    } else if (inTable) {
      break; // stop at the first table's end
    }
  }
  if (tableLines.length < 3) return [];

  const parseRow = (line: string) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => stripMd(c));

  // tableLines[0] = header, tableLines[1] = separator, rest = data rows
  return tableLines.slice(2).map((line) => {
    const [hipotesis, estado, nivel, evidencia, proximoPaso] = parseRow(line);
    const kind = classify(estado ?? "");
    return {
      hipotesis: hipotesis ?? "",
      estado: estado ?? "",
      nivel: nivel ?? "",
      evidencia: evidencia ?? "",
      proximoPaso: proximoPaso ?? "",
      kind,
      shortLabel: SHORT_LABELS[kind],
    };
  });
}

export async function fetchBoard(project: Project): Promise<BoardResult> {
  const url = `https://raw.githubusercontent.com/${project.repo}/${project.branch}/${project.boardPath}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { project, rows: [], error: `HTTP ${res.status} al leer ${url}` };
    }
    const markdown = await res.text();
    const rows = parseBoardTable(markdown);
    return { project, rows, error: rows.length ? null : "No se encontró una tabla en board.md" };
  } catch (err) {
    return { project, rows: [], error: err instanceof Error ? err.message : String(err) };
  }
}

export async function fetchAllBoards(projects: Project[]): Promise<BoardResult[]> {
  return Promise.all(projects.map(fetchBoard));
}
