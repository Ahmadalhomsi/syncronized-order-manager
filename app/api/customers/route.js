// app\api\customers\route.js
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await query('SELECT * FROM "Customers"', []);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { customerName, customerType, budget } = await request.json();
    const staticPassword = '123456'; // Static password for all customers in this test project

    const result = await query(
      'INSERT INTO "Customers" ("customerName", "customerType", budget, "totalSpent", "password") VALUES ($1, $2, $3, 0, $4) RETURNING *',
      [customerName, customerType, budget, staticPassword]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}