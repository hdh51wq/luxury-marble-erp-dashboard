import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { productionOrders } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

const VALID_STAGES = ['Cutting', 'Polishing', 'Packaging', 'Delivery'];

function validateStage(stage: string): boolean {
  return VALID_STAGES.includes(stage);
}

function validateProgress(progress: number): boolean {
  return progress >= 0 && progress <= 100;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single production order by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const order = await db
        .select()
        .from(productionOrders)
        .where(eq(productionOrders.id, parseInt(id)))
        .limit(1);

      if (order.length === 0) {
        return NextResponse.json(
          { error: 'Production order not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(order[0], { status: 200 });
    }

    // List all production orders with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const stageFilter = searchParams.get('stage');
    const statusFilter = searchParams.get('status');

    let query = db.select().from(productionOrders);
    const conditions: any[] = [];

    // Search across multiple fields
    if (search) {
      conditions.push(
        or(
          like(productionOrders.orderId, `%${search}%`),
          like(productionOrders.stage, `%${search}%`),
          like(productionOrders.status, `%${search}%`),
          like(productionOrders.assignedEmployee, `%${search}%`)
        )
      );
    }

    // Filter by stage
    if (stageFilter) {
      conditions.push(eq(productionOrders.stage, stageFilter));
    }

    // Filter by status
    if (statusFilter) {
      conditions.push(eq(productionOrders.status, statusFilter));
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, stage, progress, assignedEmployee, startDate, endDate, status } = body;

    // Validate required fields
    if (!orderId || !stage || !startDate || !status) {
      return NextResponse.json(
        {
          error: 'Missing required fields: orderId, stage, startDate, status are required',
          code: 'MISSING_REQUIRED_FIELDS',
        },
        { status: 400 }
      );
    }

    // Validate stage
    if (!validateStage(stage)) {
      return NextResponse.json(
        {
          error: `Invalid stage. Must be one of: ${VALID_STAGES.join(', ')}`,
          code: 'INVALID_STAGE',
        },
        { status: 400 }
      );
    }

    // Validate progress if provided
    const progressValue = progress !== undefined ? progress : 0;
    if (!validateProgress(progressValue)) {
      return NextResponse.json(
        {
          error: 'Progress must be between 0 and 100',
          code: 'INVALID_PROGRESS',
        },
        { status: 400 }
      );
    }

    // Prepare insert data
    const insertData: any = {
      orderId: orderId.trim(),
      stage,
      progress: progressValue,
      assignedEmployee: assignedEmployee?.trim() || null,
      startDate,
      endDate: endDate || null,
      status,
      createdAt: new Date().toISOString(),
    };

    // Check for duplicate orderId
    try {
      const newOrder = await db
        .insert(productionOrders)
        .values(insertData)
        .returning();

      return NextResponse.json(newOrder[0], { status: 201 });
    } catch (error) {
      // Handle unique constraint violation
      if ((error as Error).message.includes('UNIQUE constraint failed')) {
        return NextResponse.json(
          {
            error: 'Production order with this orderId already exists',
            code: 'DUPLICATE_ORDER_ID',
          },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if production order exists
    const existing = await db
      .select()
      .from(productionOrders)
      .where(eq(productionOrders.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Production order not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { orderId, stage, progress, assignedEmployee, startDate, endDate, status } = body;

    // Validate stage if provided
    if (stage !== undefined && !validateStage(stage)) {
      return NextResponse.json(
        {
          error: `Invalid stage. Must be one of: ${VALID_STAGES.join(', ')}`,
          code: 'INVALID_STAGE',
        },
        { status: 400 }
      );
    }

    // Validate progress if provided
    if (progress !== undefined && !validateProgress(progress)) {
      return NextResponse.json(
        {
          error: 'Progress must be between 0 and 100',
          code: 'INVALID_PROGRESS',
        },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: Record<string, any> = {};

    if (orderId !== undefined) updateData.orderId = orderId.trim();
    if (stage !== undefined) updateData.stage = stage;
    if (progress !== undefined) updateData.progress = progress;
    if (assignedEmployee !== undefined) updateData.assignedEmployee = assignedEmployee?.trim() || null;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate || null;
    if (status !== undefined) updateData.status = status;

    // Check for duplicate orderId if orderId is being updated
    if (orderId !== undefined && orderId !== existing[0].orderId) {
      try {
        const updated = await db
          .update(productionOrders)
          .set(updateData)
          .where(eq(productionOrders.id, parseInt(id)))
          .returning();

        return NextResponse.json(updated[0], { status: 200 });
      } catch (error) {
        // Handle unique constraint violation
        if ((error as Error).message.includes('UNIQUE constraint failed')) {
          return NextResponse.json(
            {
              error: 'Production order with this orderId already exists',
              code: 'DUPLICATE_ORDER_ID',
            },
            { status: 400 }
          );
        }
        throw error;
      }
    }

    const updated = await db
      .update(productionOrders)
      .set(updateData)
      .where(eq(productionOrders.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if production order exists
    const existing = await db
      .select()
      .from(productionOrders)
      .where(eq(productionOrders.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Production order not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(productionOrders)
      .where(eq(productionOrders.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Production order deleted successfully',
        deletedOrder: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}