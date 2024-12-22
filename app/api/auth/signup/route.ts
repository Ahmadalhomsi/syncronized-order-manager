import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Check if user already exists
  const existingUser = await query('SELECT * FROM "users" WHERE "email" = $1', [email]);
  if (existingUser.rowCount > 0) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Save the user
  const result = await query(
    'INSERT INTO "users" ("email", "password") VALUES ($1, $2) RETURNING *',
    [email, hashedPassword]
  );

  return NextResponse.json({ user: result.rows[0] });
}
