import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { employees } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';
import bcrypt from 'bcrypt';

// Helper function to exclude password from employee objects
const excludePassword = (employee: any) => {
  const { password, ...employeeWithoutPassword } = employee;
  return employeeWithoutPassword;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single employee by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const employee = await db
        .select()
        .from(employees)
        .where(eq(employees.id, parseInt(id)))
        .limit(1);

      if (employee.length === 0) {
        return NextResponse.json(
          { error: 'Employee not found', code: 'EMPLOYEE_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(excludePassword(employee[0]), { status: 200 });
    }

    // List all employees with filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const department = searchParams.get('department');
    const role = searchParams.get('role');

    let query = db.select().from(employees);

    // Build where conditions
    const conditions: any[] = [];

    if (search) {
      conditions.push(
        or(
          like(employees.name, `%${search}%`),
          like(employees.email, `%${search}%`),
          like(employees.department, `%${search}%`),
          like(employees.role, `%${search}%`)
        )
      );
    }

    if (department) {
      conditions.push(eq(employees.department, department));
    }

    if (role) {
      conditions.push(eq(employees.role, role));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query
      .limit(limit)
      .offset(offset);

    // Remove password from all results
    const employeesWithoutPassword = results.map(excludePassword);

    return NextResponse.json(employeesWithoutPassword, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, department, role, workingHours, performanceScore, avatar } = body;

    // Validate required fields
    if (!name || !email || !password || !department || !role) {
      return NextResponse.json(
        {
          error: 'Missing required fields: name, email, password, department, role',
          code: 'MISSING_REQUIRED_FIELDS',
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // Trim and sanitize inputs
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedName = name.trim();

    // Check if email already exists
    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.email, sanitizedEmail))
      .limit(1);

    if (existingEmployee.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists', code: 'EMAIL_EXISTS' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare insert data
    const insertData: any = {
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      department: department.trim(),
      role: role.trim(),
      workingHours: workingHours ?? 0,
      performanceScore: performanceScore ?? 0,
      avatar: avatar?.trim() || null,
      createdAt: new Date().toISOString(),
    };

    // Insert employee
    const newEmployee = await db.insert(employees).values(insertData).returning();

    return NextResponse.json(excludePassword(newEmployee[0]), { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, parseInt(id)))
      .limit(1);

    if (existingEmployee.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found', code: 'EMPLOYEE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, email, password, department, role, workingHours, performanceScore, avatar } = body;

    // Prepare update data
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      // Validate email format
      if (!email.includes('@')) {
        return NextResponse.json(
          { error: 'Invalid email format', code: 'INVALID_EMAIL' },
          { status: 400 }
        );
      }

      const sanitizedEmail = email.trim().toLowerCase();

      // Check if email already exists for another employee
      const otherEmployee = await db
        .select()
        .from(employees)
        .where(eq(employees.email, sanitizedEmail))
        .limit(1);

      if (otherEmployee.length > 0 && otherEmployee[0].id !== parseInt(id)) {
        return NextResponse.json(
          { error: 'Email already exists', code: 'EMAIL_EXISTS' },
          { status: 400 }
        );
      }

      updateData.email = sanitizedEmail;
    }

    if (password !== undefined) {
      // Hash new password
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (department !== undefined) {
      updateData.department = department.trim();
    }

    if (role !== undefined) {
      updateData.role = role.trim();
    }

    if (workingHours !== undefined) {
      updateData.workingHours = workingHours;
    }

    if (performanceScore !== undefined) {
      updateData.performanceScore = performanceScore;
    }

    if (avatar !== undefined) {
      updateData.avatar = avatar ? avatar.trim() : null;
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(excludePassword(existingEmployee[0]), { status: 200 });
    }

    // Update employee
    const updated = await db
      .update(employees)
      .set(updateData)
      .where(eq(employees.id, parseInt(id)))
      .returning();

    return NextResponse.json(excludePassword(updated[0]), { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.id, parseInt(id)))
      .limit(1);

    if (existingEmployee.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found', code: 'EMPLOYEE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete employee
    const deleted = await db
      .delete(employees)
      .where(eq(employees.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Employee deleted successfully',
        employee: excludePassword(deleted[0]),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}