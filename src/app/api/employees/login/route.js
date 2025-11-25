import { NextResponse } from 'next/server';
import { getMongoDb } from '@/db/mongodb';
import { compare } from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await getMongoDb();
    
    // Find employee
    const employee = await db.collection('employees').findOne({ email });
    
    if (!employee) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await compare(password, employee.password);
    
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
      employee: {
        ...employeeData,
        _id: employeeData._id.toString()
      }
    });
  } catch (error) {
    console.error('Error during employee login:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
