import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clients } from '@/db/schema';
import { eq, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const client = await db.select()
        .from(clients)
        .where(eq(clients.id, parseInt(id)))
        .limit(1);

      if (client.length === 0) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }

      return NextResponse.json(client[0], { status: 200 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const statusFilter = searchParams.get('status');

    let query = db.select().from(clients);

    const conditions: any[] = [];

    if (search) {
      conditions.push(
        or(
          like(clients.name, `%${search}%`),
          like(clients.company, `%${search}%`),
          like(clients.email, `%${search}%`),
          like(clients.phone, `%${search}%`)
        )
      );
    }

    if (statusFilter) {
      conditions.push(eq(clients.status, statusFilter));
    }

    if (conditions.length > 0) {
      query = query.where(or(...conditions)) as any;
    }

    const results = await query
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, company, email, phone, address, status, totalProjects, totalRevenue } = body;

    if (!name) {
      return NextResponse.json({ 
        error: 'Name is required',
        code: 'MISSING_NAME' 
      }, { status: 400 });
    }

    if (!company) {
      return NextResponse.json({ 
        error: 'Company is required',
        code: 'MISSING_COMPANY' 
      }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required',
        code: 'MISSING_EMAIL' 
      }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ 
        error: 'Invalid email format',
        code: 'INVALID_EMAIL' 
      }, { status: 400 });
    }

    if (!phone) {
      return NextResponse.json({ 
        error: 'Phone is required',
        code: 'MISSING_PHONE' 
      }, { status: 400 });
    }

    const existingClient = await db.select()
      .from(clients)
      .where(eq(clients.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingClient.length > 0) {
      return NextResponse.json({ 
        error: 'Email already exists',
        code: 'DUPLICATE_EMAIL' 
      }, { status: 400 });
    }

    const newClient: any = await db.insert(clients)
      .values({
        name: name.trim(),
        company: company.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: address?.trim() || null,
        status: status?.trim() || 'active',
        totalProjects: totalProjects ?? 0,
        totalRevenue: totalRevenue ?? 0,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newClient[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ 
        error: 'Email already exists',
        code: 'DUPLICATE_EMAIL' 
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
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

    const existingClient = await db.select()
      .from(clients)
      .where(eq(clients.id, parseInt(id)))
      .limit(1);

    if (existingClient.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, company, email, phone, address, status, totalProjects, totalRevenue } = body;

    if (email && !email.includes('@')) {
      return NextResponse.json({ 
        error: 'Invalid email format',
        code: 'INVALID_EMAIL' 
      }, { status: 400 });
    }

    if (email && email.toLowerCase().trim() !== existingClient[0].email) {
      const emailCheck = await db.select()
        .from(clients)
        .where(eq(clients.email, email.toLowerCase().trim()))
        .limit(1);

      if (emailCheck.length > 0) {
        return NextResponse.json({ 
          error: 'Email already exists',
          code: 'DUPLICATE_EMAIL' 
        }, { status: 400 });
      }
    }

    const updates: any = {};
    
    if (name !== undefined) updates.name = name.trim();
    if (company !== undefined) updates.company = company.trim();
    if (email !== undefined) updates.email = email.toLowerCase().trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (address !== undefined) updates.address = address?.trim() || null;
    if (status !== undefined) updates.status = status.trim();
    if (totalProjects !== undefined) updates.totalProjects = totalProjects;
    if (totalRevenue !== undefined) updates.totalRevenue = totalRevenue;

    const updatedClient = await db.update(clients)
      .set(updates)
      .where(eq(clients.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedClient[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ 
        error: 'Email already exists',
        code: 'DUPLICATE_EMAIL' 
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
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

    const existingClient = await db.select()
      .from(clients)
      .where(eq(clients.id, parseInt(id)))
      .limit(1);

    if (existingClient.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const deleted = await db.delete(clients)
      .where(eq(clients.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Client deleted successfully',
      client: deleted[0]
    }, { status: 200 });
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}