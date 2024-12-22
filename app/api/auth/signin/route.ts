import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { generateToken } from '@/lib/token';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Find the user
  const result = await query('SELECT * FROM "users" WHERE "email" = $1', [email]);
  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const user : any = result.rows[0];

  // Verify password
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Generate a token
  const token = generateToken({ id: user.id, email: user.email });

  return NextResponse.json({ token, user: { id: user.id, email: user.email } });
}
