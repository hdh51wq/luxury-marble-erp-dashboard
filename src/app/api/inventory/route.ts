import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { marbleInventory } from '@/db/schema';
import { eq, like, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(marbleInventory)
        .where(eq(marbleInventory.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'Inventory item not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const marbleTypeFilter = searchParams.get('marbleType');
    const qualityFilter = searchParams.get('quality');
    const locationFilter = searchParams.get('location');

    let query = db.select().from(marbleInventory);

    const conditions: any[] = [];

    // Search across multiple fields
    if (search) {
      conditions.push(
        or(
          like(marbleInventory.marbleType, `%${search}%`),
          like(marbleInventory.size, `%${search}%`),
          like(marbleInventory.quality, `%${search}%`),
          like(marbleInventory.location, `%${search}%`)
        )
      );
    }

    // Filter by marbleType
    if (marbleTypeFilter) {
      conditions.push(eq(marbleInventory.marbleType, marbleTypeFilter));
    }

    // Filter by quality
    if (qualityFilter) {
      conditions.push(eq(marbleInventory.quality, qualityFilter));
    }

    // Filter by location
    if (locationFilter) {
      conditions.push(eq(marbleInventory.location, locationFilter));
    }

    // Apply conditions if any exist
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply ordering, pagination
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
    const { marbleType, size, quality, quantity, pricePerUnit, location } = body;

    // Validate required fields
    if (!marbleType) {
      return NextResponse.json(
        { error: 'marbleType is required', code: 'MISSING_MARBLE_TYPE' },
        { status: 400 }
      );
    }

    if (!size) {
      return NextResponse.json(
        { error: 'size is required', code: 'MISSING_SIZE' },
        { status: 400 }
      );
    }

    if (!quality) {
      return NextResponse.json(
        { error: 'quality is required', code: 'MISSING_QUALITY' },
        { status: 400 }
      );
    }

    if (quantity === undefined || quantity === null) {
      return NextResponse.json(
        { error: 'quantity is required', code: 'MISSING_QUANTITY' },
        { status: 400 }
      );
    }

    if (pricePerUnit === undefined || pricePerUnit === null) {
      return NextResponse.json(
        { error: 'pricePerUnit is required', code: 'MISSING_PRICE_PER_UNIT' },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json(
        { error: 'location is required', code: 'MISSING_LOCATION' },
        { status: 400 }
      );
    }

    // Validate quantity is a positive integer
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json(
        { error: 'quantity must be a positive integer', code: 'INVALID_QUANTITY' },
        { status: 400 }
      );
    }

    // Validate pricePerUnit is a positive integer
    const parsedPricePerUnit = parseInt(pricePerUnit);
    if (isNaN(parsedPricePerUnit) || parsedPricePerUnit <= 0) {
      return NextResponse.json(
        { error: 'pricePerUnit must be a positive integer', code: 'INVALID_PRICE_PER_UNIT' },
        { status: 400 }
      );
    }

    // Create new inventory item
    const newInventory: any = await db
      .insert(marbleInventory)
      .values({
        marbleType: marbleType.trim(),
        size: size.trim(),
        quality: quality.trim(),
        quantity: parsedQuantity,
        pricePerUnit: parsedPricePerUnit,
        location: location.trim(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newInventory[0], { status: 201 });
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

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(marbleInventory)
      .where(eq(marbleInventory.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Inventory item not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { marbleType, size, quality, quantity, pricePerUnit, location } = body;

    // Build update object with only provided fields
    const updates: any = {};

    if (marbleType !== undefined) {
      updates.marbleType = marbleType.trim();
    }

    if (size !== undefined) {
      updates.size = size.trim();
    }

    if (quality !== undefined) {
      updates.quality = quality.trim();
    }

    if (quantity !== undefined) {
      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return NextResponse.json(
          { error: 'quantity must be a positive integer', code: 'INVALID_QUANTITY' },
          { status: 400 }
        );
      }
      updates.quantity = parsedQuantity;
    }

    if (pricePerUnit !== undefined) {
      const parsedPricePerUnit = parseInt(pricePerUnit);
      if (isNaN(parsedPricePerUnit) || parsedPricePerUnit <= 0) {
        return NextResponse.json(
          { error: 'pricePerUnit must be a positive integer', code: 'INVALID_PRICE_PER_UNIT' },
          { status: 400 }
        );
      }
      updates.pricePerUnit = parsedPricePerUnit;
    }

    if (location !== undefined) {
      updates.location = location.trim();
    }

    // Check if there are any updates to apply
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    // Update the record
    const updated = await db
      .update(marbleInventory)
      .set(updates)
      .where(eq(marbleInventory.id, parseInt(id)))
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

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(marbleInventory)
      .where(eq(marbleInventory.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Inventory item not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the record
    const deleted = await db
      .delete(marbleInventory)
      .where(eq(marbleInventory.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Inventory item deleted successfully',
        deletedItem: deleted[0],
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