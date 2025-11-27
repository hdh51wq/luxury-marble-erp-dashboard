import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { account, session } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcrypt';

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

export async function PATCH(request: NextRequest) {
  try {
    // Authenticate user
    const userSession = await validateSession(request);
    if (!userSession) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = userSession.userId;

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || typeof currentPassword !== 'string' || currentPassword.trim() === '') {
      return NextResponse.json(
        { error: 'Current password is required', code: 'MISSING_CURRENT_PASSWORD' },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim() === '') {
      return NextResponse.json(
        { error: 'New password is required', code: 'MISSING_NEW_PASSWORD' },
        { status: 400 }
      );
    }

    // Validate new password length
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long', code: 'PASSWORD_TOO_SHORT' },
        { status: 400 }
      );
    }

    // Get user's credential account
    const accounts = await db
      .select()
      .from(account)
      .where(
        and(
          eq(account.userId, userId),
          eq(account.providerId, 'credential')
        )
      )
      .limit(1);

    if (accounts.length === 0) {
      return NextResponse.json(
        { error: 'Credential account not found', code: 'ACCOUNT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const userAccount = accounts[0];

    // Verify password field exists
    if (!userAccount.password) {
      return NextResponse.json(
        { error: 'No password set for this account', code: 'NO_PASSWORD_SET' },
        { status: 400 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, userAccount.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect', code: 'INVALID_CURRENT_PASSWORD' },
        { status: 401 }
      );
    }

    // Hash new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    const updated = await db
      .update(account)
      .set({
        password: newHashedPassword,
        updatedAt: Date.now()
      })
      .where(
        and(
          eq(account.userId, userId),
          eq(account.providerId, 'credential')
        )
      )
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update password', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Password updated successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('PATCH /api/user/password error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}