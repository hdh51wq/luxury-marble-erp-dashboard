import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { account, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    // Hash the password "adminadmin" with 10 salt rounds
    const hashedPassword = await bcrypt.hash('adminadmin', 10);

    // Find the admin user by email
    const adminUser = await db.select()
      .from(user)
      .where(eq(user.email, 'admin@marbrerie.com'))
      .limit(1);

    if (adminUser.length === 0) {
      return NextResponse.json({ 
        error: 'Admin user not found',
        code: 'ADMIN_NOT_FOUND'
      }, { status: 404 });
    }

    // Update the account table where user_id matches and provider_id = 'credential'
    const updatedAccount = await db.update(account)
      .set({
        password: hashedPassword,
        updatedAt: Date.now()
      })
      .where(
        and(
          eq(account.userId, adminUser[0].id),
          eq(account.providerId, 'credential')
        )
      )
      .returning();

    if (updatedAccount.length === 0) {
      return NextResponse.json({ 
        error: 'Admin credential account not found',
        code: 'ACCOUNT_NOT_FOUND'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin password updated successfully',
      email: 'admin@marbrerie.com',
      password_hash: hashedPassword,
      updated_at: updatedAccount[0].updatedAt
    }, { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}