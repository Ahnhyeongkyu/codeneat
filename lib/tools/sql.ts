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
    // Remove comments while preserving string literals
    let result = "";
    let i = 0;
    while (i < input.length) {
      // Single-quoted string literal
      if (input[i] === "'") {
        let j = i + 1;
        while (j < input.length) {
          if (input[j] === "'" && input[j + 1] === "'") {
            j += 2; // escaped quote
          } else if (input[j] === "'") {
            j++;
            break;
          } else {
            j++;
          }
        }
        result += input.slice(i, j);
        i = j;
      // Double-quoted identifier
      } else if (input[i] === '"') {
        let j = i + 1;
        while (j < input.length && input[j] !== '"') j++;
        result += input.slice(i, j + 1);
        i = j + 1;
      // Block comment
      } else if (input[i] === "/" && input[i + 1] === "*") {
        const end = input.indexOf("*/", i + 2);
        i = end === -1 ? input.length : end + 2;
      // Line comment
      } else if (input[i] === "-" && input[i + 1] === "-") {
        const end = input.indexOf("\n", i);
        i = end === -1 ? input.length : end;
      } else {
        result += input[i];
        i++;
      }
    }
    const output = result.replace(/\s+/g, " ").trim();
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
