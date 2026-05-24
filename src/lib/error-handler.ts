import { NextResponse } from 'next/server';

interface PgError { code?: string; message?: string; }

export function handleDbError(err: unknown): NextResponse {
  const pgErr = err as PgError;
  console.error('DB Error:', pgErr.code, pgErr.message);

  switch (pgErr.code) {
    case '23505': // unique_violation
      return NextResponse.json({ error: 'A record with this value already exists' }, { status: 409 });
    case '23502': // not_null_violation
      return NextResponse.json({ error: 'Required field missing' }, { status: 400 });
    case '23503': // foreign_key_violation
      return NextResponse.json({ error: 'Referenced record does not exist' }, { status: 400 });
    case '23514': // check_violation
      return NextResponse.json({ error: 'Value violates database constraint' }, { status: 400 });
    case '22001': // string_data_right_truncation
      return NextResponse.json({ error: 'Input value too long' }, { status: 400 });
    default:
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
