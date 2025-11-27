import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, session } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';

async function validateSession(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  const sessions = await db.select().from(session).where(eq(session.token, token)).limit(1);
  
  if (sessions.length === 0) {
    return null;
  }
  
  const userSession = sessions[0];
  if (userSession.expiresAt < Date.now()) {
    return null;
  }
  
  return userSession;
}

export async function GET(request: NextRequest) {
  try {
    const userSession = await validateSession(request);
    
    if (!userSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const users = await db.select().from(user).where(eq(user.id, userSession.userId)).limit(1);

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(users[0], { status: 200 });
  } catch (error) {
    console.error('GET /api/user/profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userSession = await validateSession(request);
    
    if (!userSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, image } = body;

    const updates: Record<string, any> = {};

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return NextResponse.json(
          { error: 'Name cannot be empty', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = trimmedName;
    }

    if (email !== undefined) {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail.includes('@')) {
        return NextResponse.json(
          { error: 'Invalid email format', code: 'INVALID_EMAIL' },
          { status: 400 }
        );
      }

      const existingUsers = await db.select()
        .from(user)
        .where(and(eq(user.email, trimmedEmail), ne(user.id, userSession.userId)))
        .limit(1);

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { error: 'Email already exists for another user', code: 'EMAIL_EXISTS' },
          { status: 400 }
        );
      }

      updates.email = trimmedEmail;
    }

    if (image !== undefined) {
      updates.image = image;
    }

    if (Object.keys(updates).length === 0) {
      const users = await db.select().from(user).where(eq(user.id, userSession.userId)).limit(1);
      
      if (users.length === 0) {
        return NextResponse.json(
          { error: 'User not found', code: 'USER_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(users[0], { status: 200 });
    }

    updates.updatedAt = Date.now();

    const updatedUsers = await db.update(user)
      .set(updates)
      .where(eq(user.id, userSession.userId))
      .returning();

    if (updatedUsers.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUsers[0], { status: 200 });
  } catch (error) {
    console.error('PATCH /api/user/profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}