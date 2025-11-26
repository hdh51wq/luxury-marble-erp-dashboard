import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, clients } from '@/db/schema';
import { eq, like, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const project = await db.select()
        .from(projects)
        .where(eq(projects.id, parseInt(id)))
        .limit(1);

      if (project.length === 0) {
        return NextResponse.json({ 
          error: 'Project not found',
          code: 'PROJECT_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(project[0], { status: 200 });
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');

    let query = db.select().from(projects);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(like(projects.name, `%${search}%`));
    }

    if (clientId) {
      if (isNaN(parseInt(clientId))) {
        return NextResponse.json({ 
          error: "Valid client ID is required",
          code: "INVALID_CLIENT_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(projects.clientId, parseInt(clientId)));
    }

    if (status) {
      conditions.push(eq(projects.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, clientId, budget, dueDate, status, progress } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ 
        error: "Project name is required",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!clientId || typeof clientId !== 'number') {
      return NextResponse.json({ 
        error: "Valid client ID is required",
        code: "MISSING_CLIENT_ID" 
      }, { status: 400 });
    }

    if (!budget || typeof budget !== 'number' || budget <= 0) {
      return NextResponse.json({ 
        error: "Valid positive budget is required",
        code: "INVALID_BUDGET" 
      }, { status: 400 });
    }

    if (!dueDate || typeof dueDate !== 'string' || dueDate.trim() === '') {
      return NextResponse.json({ 
        error: "Due date is required",
        code: "MISSING_DUE_DATE" 
      }, { status: 400 });
    }

    if (!status || typeof status !== 'string' || status.trim() === '') {
      return NextResponse.json({ 
        error: "Status is required",
        code: "MISSING_STATUS" 
      }, { status: 400 });
    }

    // Validate progress if provided
    if (progress !== undefined && (typeof progress !== 'number' || progress < 0 || progress > 100)) {
      return NextResponse.json({ 
        error: "Progress must be between 0 and 100",
        code: "INVALID_PROGRESS" 
      }, { status: 400 });
    }

    // Check if client exists
    const clientExists = await db.select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .limit(1);

    if (clientExists.length === 0) {
      return NextResponse.json({ 
        error: 'Client not found',
        code: 'CLIENT_NOT_FOUND' 
      }, { status: 404 });
    }

    // Prepare insert data
    const insertData = {
      name: name.trim(),
      clientId,
      budget,
      dueDate: dueDate.trim(),
      status: status.trim(),
      progress: progress !== undefined ? progress : 0,
      createdAt: new Date().toISOString()
    };

    const newProject = await db.insert(projects)
      .values(insertData)
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if project exists
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { name, clientId, budget, dueDate, status, progress } = body;

    // Validate fields if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return NextResponse.json({ 
        error: "Project name cannot be empty",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    if (clientId !== undefined) {
      if (typeof clientId !== 'number') {
        return NextResponse.json({ 
          error: "Valid client ID is required",
          code: "INVALID_CLIENT_ID" 
        }, { status: 400 });
      }

      // Check if client exists
      const clientExists = await db.select()
        .from(clients)
        .where(eq(clients.id, clientId))
        .limit(1);

      if (clientExists.length === 0) {
        return NextResponse.json({ 
          error: 'Client not found',
          code: 'CLIENT_NOT_FOUND' 
        }, { status: 404 });
      }
    }

    if (budget !== undefined && (typeof budget !== 'number' || budget <= 0)) {
      return NextResponse.json({ 
        error: "Budget must be a positive number",
        code: "INVALID_BUDGET" 
      }, { status: 400 });
    }

    if (dueDate !== undefined && (typeof dueDate !== 'string' || dueDate.trim() === '')) {
      return NextResponse.json({ 
        error: "Due date cannot be empty",
        code: "INVALID_DUE_DATE" 
      }, { status: 400 });
    }

    if (status !== undefined && (typeof status !== 'string' || status.trim() === '')) {
      return NextResponse.json({ 
        error: "Status cannot be empty",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    if (progress !== undefined && (typeof progress !== 'number' || progress < 0 || progress > 100)) {
      return NextResponse.json({ 
        error: "Progress must be between 0 and 100",
        code: "INVALID_PROGRESS" 
      }, { status: 400 });
    }

    // Build update object with only provided fields
    const updates: any = {};

    if (name !== undefined) updates.name = name.trim();
    if (clientId !== undefined) updates.clientId = clientId;
    if (budget !== undefined) updates.budget = budget;
    if (dueDate !== undefined) updates.dueDate = dueDate.trim();
    if (status !== undefined) updates.status = status.trim();
    if (progress !== undefined) updates.progress = progress;

    const updated = await db.update(projects)
      .set(updates)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if project exists
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(projects)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Project deleted successfully',
      project: deleted[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}