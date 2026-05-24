export type AllowedFields = Record<string, 'text' | 'jsonb' | 'int' | 'boolean' | 'numeric'>;

export function buildUpdateQuery(
  table: string,
  id: number,
  body: Record<string, unknown>,
  allowedFields: AllowedFields
): { text: string; values: unknown[] } | null {
  const setClauses: string[] = [];
  const values: unknown[] = [];

  for (const [field, type] of Object.entries(allowedFields)) {
    if (body[field] === undefined) continue;
    if (type === 'jsonb') {
      values.push(JSON.stringify(body[field]));
      setClauses.push(`${field} = $${values.length}::jsonb`);
    } else {
      values.push(body[field]);
      setClauses.push(`${field} = $${values.length}`);
    }
  }

  if (setClauses.length === 0) return null;

  values.push(id);
  return {
    text: `UPDATE ${table} SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
    values,
  };
}
