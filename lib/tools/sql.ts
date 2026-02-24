import { format as sqlFormat } from "sql-formatter";

export interface SqlResult {
  output: string;
  error: string | null;
}

export type SqlDialect =
  | "sql"
  | "mysql"
  | "postgresql"
  | "sqlite"
  | "transactsql"
  | "plsql"
  | "mariadb";

export const SQL_DIALECTS: { value: SqlDialect; label: string }[] = [
  { value: "sql", label: "Standard SQL" },
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "transactsql", label: "SQL Server" },
  { value: "plsql", label: "PL/SQL" },
  { value: "mariadb", label: "MariaDB" },
];

export function formatSql(
  input: string,
  dialect: SqlDialect = "sql",
  indent: number = 2
): SqlResult {
  try {
    if (!input.trim()) {
      return { output: "", error: null };
    }
    const output = sqlFormat(input, {
      language: dialect,
      tabWidth: indent,
      keywordCase: "upper",
      linesBetweenQueries: 2,
    });
    return { output, error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export function minifySql(input: string): SqlResult {
  try {
    if (!input.trim()) {
      return { output: "", error: null };
    }
    const output = input
      .replace(/--.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .trim();
    return { output, error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export const SQL_SAMPLE = `SELECT u.id, u.name, u.email, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
AND u.status = 'active'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC
LIMIT 10;`;
