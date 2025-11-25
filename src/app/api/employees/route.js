import { NextResponse } from 'next/server';
import { getMongoDb } from '@/db/mongodb';
import { hash } from 'bcryptjs';

// GET all employees
export async function GET(request) {
  try {
    const db = await getMongoDb();
    const employees = await db.collection('employees').find({}).toArray();
    
    // Remove password from response
    const sanitizedEmployees = employees.map(({ password, ...employee }) => ({
      ...employee,
      _id: employee._id.toString()
    }));
    
    return NextResponse.json({ employees: sanitizedEmployees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST create new employee
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const validRoles = ['stock', 'production', 'ventes', 'employe', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const db = await getMongoDb();
    
    // Check if email already exists
    const existingEmployee = await db.collection('employees').findOne({ email });
    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create employee
    const newEmployee = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      status: 'active',
      department: role === 'stock' ? 'Stock' : role === 'production' ? 'Production' : role === 'ventes' ? 'Sales' : 'General',
      hoursWorked: 0,
      performance: 100
    };

    const result = await db.collection('employees').insertOne(newEmployee);

    return NextResponse.json({
      success: true,
      employee: {
        ...newEmployee,
        _id: result.insertedId.toString(),
        password: undefined
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
