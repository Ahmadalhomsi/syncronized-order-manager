// app/api/customers/generate/route.js
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { customers } = await request.json();
    
    // Using a transaction to ensure all customers are created or none
    await query('BEGIN');
    
    const results = await Promise.all(
      customers.map(customer => 
        query(
          'INSERT INTO "Customers" ("customerName", "customerType", budget, "totalSpent") VALUES ($1, $2, $3, $4) RETURNING *',
          [
            customer.customerName,
            customer.customerType,
            customer.budget,
            customer.totalSpent
          ]
        )
      )
    );
    
    await query('COMMIT');
    
    return NextResponse.json(results.map(result => result.rows[0]));
  } catch (error) {
    await query('ROLLBACK');
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}