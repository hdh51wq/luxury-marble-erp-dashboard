import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sales, clients } from '@/db/schema';
import { eq, like, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single sale by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const sale = await db.select()
        .from(sales)
        .where(eq(sales.id, parseInt(id)))
        .limit(1);

      if (sale.length === 0) {
        return NextResponse.json({ 
          error: 'Sale not found',
          code: 'SALE_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(sale[0], { status: 200 });
    }

    // List all sales with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const clientId = searchParams.get('clientId');

    let query = db.select().from(sales);

    const conditions: any[] = [];

    if (search) {
      conditions.push(like(sales.projectName, `%${search}%`));
    }

    if (status) {
      conditions.push(eq(sales.status, status));
    }

    if (paymentStatus) {
      conditions.push(eq(sales.paymentStatus, paymentStatus));
    }

    if (clientId && !isNaN(parseInt(clientId))) {
      conditions.push(eq(sales.clientId, parseInt(clientId)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query
      .limit(limit)
      .offset(offset);

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
    const { clientId, projectName, amount, status, paymentStatus } = body;

    // Validate required fields
    if (!clientId) {
      return NextResponse.json({ 
        error: 'Client ID is required',
        code: 'MISSING_CLIENT_ID' 
      }, { status: 400 });
    }

    if (!projectName || projectName.trim() === '') {
      return NextResponse.json({ 
        error: 'Project name is required',
        code: 'MISSING_PROJECT_NAME' 
      }, { status: 400 });
    }

    if (amount === undefined || amount === null) {
      return NextResponse.json({ 
        error: 'Amount is required',
        code: 'MISSING_AMOUNT' 
      }, { status: 400 });
    }

    if (!status || status.trim() === '') {
      return NextResponse.json({ 
        error: 'Status is required',
        code: 'MISSING_STATUS' 
      }, { status: 400 });
    }

    if (!paymentStatus || paymentStatus.trim() === '') {
      return NextResponse.json({ 
        error: 'Payment status is required',
        code: 'MISSING_PAYMENT_STATUS' 
      }, { status: 400 });
    }

    // Validate clientId is a valid integer
    if (isNaN(parseInt(clientId))) {
      return NextResponse.json({ 
        error: 'Client ID must be a valid integer',
        code: 'INVALID_CLIENT_ID' 
      }, { status: 400 });
    }

    // Validate amount is a positive integer
    if (isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
      return NextResponse.json({ 
        error: 'Amount must be a positive integer',
        code: 'INVALID_AMOUNT' 
      }, { status: 400 });
    }

    // Check if client exists
    const client = await db.select()
      .from(clients)
      .where(eq(clients.id, parseInt(clientId)))
      .limit(1);

    if (client.length === 0) {
      return NextResponse.json({ 
        error: 'Client not found',
        code: 'CLIENT_NOT_FOUND' 
      }, { status: 400 });
    }

    // Create new sale
    const newSale: any = await db.insert(sales)
      .values({
        clientId: parseInt(clientId),
        projectName: projectName.trim(),
        amount: parseInt(amount),
        status: status.trim(),
        paymentStatus: paymentStatus.trim(),
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newSale[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    // Check if sale exists
    const existingSale = await db.select()
      .from(sales)
      .where(eq(sales.id, parseInt(id)))
      .limit(1);

    if (existingSale.length === 0) {
      return NextResponse.json({ 
        error: 'Sale not found',
        code: 'SALE_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { clientId, projectName, amount, status, paymentStatus } = body;

    const updates: Record<string, any> = {};

    // Validate and add clientId if provided
    if (clientId !== undefined) {
      if (isNaN(parseInt(clientId))) {
        return NextResponse.json({ 
          error: 'Client ID must be a valid integer',
          code: 'INVALID_CLIENT_ID' 
        }, { status: 400 });
      }

      // Check if client exists
      const client = await db.select()
        .from(clients)
        .where(eq(clients.id, parseInt(clientId)))
        .limit(1);

      if (client.length === 0) {
        return NextResponse.json({ 
          error: 'Client not found',
          code: 'CLIENT_NOT_FOUND' 
        }, { status: 400 });
      }

      updates.clientId = parseInt(clientId);
    }

    // Validate and add projectName if provided
    if (projectName !== undefined) {
      if (projectName.trim() === '') {
        return NextResponse.json({ 
          error: 'Project name cannot be empty',
          code: 'INVALID_PROJECT_NAME' 
        }, { status: 400 });
      }
      updates.projectName = projectName.trim();
    }

    // Validate and add amount if provided
    if (amount !== undefined) {
      if (isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
        return NextResponse.json({ 
          error: 'Amount must be a positive integer',
          code: 'INVALID_AMOUNT' 
        }, { status: 400 });
      }
      updates.amount = parseInt(amount);
    }

    // Add status if provided
    if (status !== undefined) {
      if (status.trim() === '') {
        return NextResponse.json({ 
          error: 'Status cannot be empty',
          code: 'INVALID_STATUS' 
        }, { status: 400 });
      }
      updates.status = status.trim();
    }

    // Add paymentStatus if provided
    if (paymentStatus !== undefined) {
      if (paymentStatus.trim() === '') {
        return NextResponse.json({ 
          error: 'Payment status cannot be empty',
          code: 'INVALID_PAYMENT_STATUS' 
        }, { status: 400 });
      }
      updates.paymentStatus = paymentStatus.trim();
    }

    // Update sale
    const updatedSale = await db.update(sales)
      .set(updates)
      .where(eq(sales.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedSale[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    // Check if sale exists
    const existingSale = await db.select()
      .from(sales)
      .where(eq(sales.id, parseInt(id)))
      .limit(1);

    if (existingSale.length === 0) {
      return NextResponse.json({ 
        error: 'Sale not found',
        code: 'SALE_NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete sale
    const deleted = await db.delete(sales)
      .where(eq(sales.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Sale deleted successfully',
      sale: deleted[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}