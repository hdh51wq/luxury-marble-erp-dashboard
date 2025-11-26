import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clientNotes, clients } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const VALID_NOTE_TYPES = ['quote', 'reminder', 'note'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single note by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const note = await db
        .select()
        .from(clientNotes)
        .where(eq(clientNotes.id, parseInt(id)))
        .limit(1);

      if (note.length === 0) {
        return NextResponse.json(
          { error: 'Client note not found', code: 'NOTE_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(note[0], { status: 200 });
    }

    // List notes with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const clientId = searchParams.get('clientId');
    const type = searchParams.get('type');

    let query = db.select().from(clientNotes);

    const conditions = [];

    if (clientId) {
      if (isNaN(parseInt(clientId))) {
        return NextResponse.json(
          { error: 'Valid client ID is required', code: 'INVALID_CLIENT_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(clientNotes.clientId, parseInt(clientId)));
    }

    if (type) {
      if (!VALID_NOTE_TYPES.includes(type)) {
        return NextResponse.json(
          { 
            error: `Invalid note type. Must be one of: ${VALID_NOTE_TYPES.join(', ')}`, 
            code: 'INVALID_NOTE_TYPE' 
          },
          { status: 400 }
        );
      }
      conditions.push(eq(clientNotes.type, type));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);

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
    const { clientId, content, type } = body;

    // Validate required fields
    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required', code: 'MISSING_CLIENT_ID' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required', code: 'MISSING_TYPE' },
        { status: 400 }
      );
    }

    // Validate clientId is a valid integer
    if (isNaN(parseInt(clientId))) {
      return NextResponse.json(
        { error: 'Valid client ID is required', code: 'INVALID_CLIENT_ID' },
        { status: 400 }
      );
    }

    // Validate content is not empty after trimming
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return NextResponse.json(
        { error: 'Content cannot be empty', code: 'EMPTY_CONTENT' },
        { status: 400 }
      );
    }

    // Validate type
    const trimmedType = type.trim().toLowerCase();
    if (!VALID_NOTE_TYPES.includes(trimmedType)) {
      return NextResponse.json(
        { 
          error: `Invalid note type. Must be one of: ${VALID_NOTE_TYPES.join(', ')}`, 
          code: 'INVALID_NOTE_TYPE' 
        },
        { status: 400 }
      );
    }

    // Validate client exists
    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, parseInt(clientId)))
      .limit(1);

    if (client.length === 0) {
      return NextResponse.json(
        { error: 'Client not found', code: 'CLIENT_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Create new client note
    const newNote = await db
      .insert(clientNotes)
      .values({
        clientId: parseInt(clientId),
        content: trimmedContent,
        type: trimmedType,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newNote[0], { status: 201 });
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if note exists
    const existingNote = await db
      .select()
      .from(clientNotes)
      .where(eq(clientNotes.id, parseInt(id)))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { error: 'Client note not found', code: 'NOTE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { clientId, content, type } = body;

    const updates: any = {};

    // Validate and add clientId if provided
    if (clientId !== undefined) {
      if (isNaN(parseInt(clientId))) {
        return NextResponse.json(
          { error: 'Valid client ID is required', code: 'INVALID_CLIENT_ID' },
          { status: 400 }
        );
      }

      // Validate client exists
      const client = await db
        .select()
        .from(clients)
        .where(eq(clients.id, parseInt(clientId)))
        .limit(1);

      if (client.length === 0) {
        return NextResponse.json(
          { error: 'Client not found', code: 'CLIENT_NOT_FOUND' },
          { status: 404 }
        );
      }

      updates.clientId = parseInt(clientId);
    }

    // Validate and add content if provided
    if (content !== undefined) {
      const trimmedContent = content.trim();
      if (trimmedContent.length === 0) {
        return NextResponse.json(
          { error: 'Content cannot be empty', code: 'EMPTY_CONTENT' },
          { status: 400 }
        );
      }
      updates.content = trimmedContent;
    }

    // Validate and add type if provided
    if (type !== undefined) {
      const trimmedType = type.trim().toLowerCase();
      if (!VALID_NOTE_TYPES.includes(trimmedType)) {
        return NextResponse.json(
          { 
            error: `Invalid note type. Must be one of: ${VALID_NOTE_TYPES.join(', ')}`, 
            code: 'INVALID_NOTE_TYPE' 
          },
          { status: 400 }
        );
      }
      updates.type = trimmedType;
    }

    // Update the note
    const updated = await db
      .update(clientNotes)
      .set(updates)
      .where(eq(clientNotes.id, parseInt(id)))
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if note exists
    const existingNote = await db
      .select()
      .from(clientNotes)
      .where(eq(clientNotes.id, parseInt(id)))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { error: 'Client note not found', code: 'NOTE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete the note
    const deleted = await db
      .delete(clientNotes)
      .where(eq(clientNotes.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Client note deleted successfully',
        note: deleted[0],
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