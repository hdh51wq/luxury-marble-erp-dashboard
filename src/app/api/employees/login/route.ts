import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { employees } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find employee by email
    const employeeList = await db
      .select()
      .from(employees)
      .where(eq(employees.email, email.trim().toLowerCase()))
      .limit(1);

    if (employeeList.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const employee = employeeList[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, employee.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return employee data without password
    const { password: _, ...employeeData } = employee;

    return NextResponse.json({
      success: true,
      employee: employeeData
    });
  } catch (error: any) {
    console.error('Error during employee login:', error);
    return NextResponse.json(
      { error: 'Login failed: ' + error.message },
      { status: 500 }
    );
  }
}