import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { employees, user, account } from '@/db/schema';
import { eq, not, sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const fixedAccounts: Array<{ email: string; name: string; temporary_password: string }> = [];
    const fixedEmployees: Array<{ email: string; name: string; temporary_password: string }> = [];
    const temporaryPassword = 'TempPass123!';

    // Generate bcrypt hash for temporary password
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(temporaryPassword, 10);
    } catch (error) {
      console.error('Bcrypt hashing error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to generate password hash',
          code: 'BCRYPT_ERROR' 
        },
        { status: 500 }
      );
    }

    // Step 1: Fix invalid account passwords
    try {
      const invalidAccounts = await db
        .select()
        .from(account)
        .where(
          sql`${account.providerId} = 'credential' AND (${account.password} IS NULL OR ${account.password} NOT LIKE '$2b$10$%')`
        );

      for (const acc of invalidAccounts) {
        // Update account password
        await db
          .update(account)
          .set({
            password: hashedPassword,
            updatedAt: Math.floor(Date.now() / 1000)
          })
          .where(eq(account.id, acc.id));

        // Find matching user
        const matchingUser = await db
          .select()
          .from(user)
          .where(eq(user.id, acc.userId))
          .limit(1);

        if (matchingUser.length > 0) {
          const userRecord = matchingUser[0];

          // Find matching employee by email
          const matchingEmployee = await db
            .select()
            .from(employees)
            .where(eq(employees.email, userRecord.email))
            .limit(1);

          if (matchingEmployee.length > 0) {
            // Update employee password
            await db
              .update(employees)
              .set({
                password: hashedPassword
              })
              .where(eq(employees.id, matchingEmployee[0].id));
          }

          fixedAccounts.push({
            email: userRecord.email,
            name: userRecord.name,
            temporary_password: temporaryPassword
          });
        }
      }
    } catch (error) {
      console.error('Account query/update error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to process accounts: ' + (error as Error).message,
          code: 'ACCOUNT_PROCESSING_ERROR' 
        },
        { status: 500 }
      );
    }

    // Step 2: Fix invalid employee passwords
    try {
      const invalidEmployees = await db
        .select()
        .from(employees)
        .where(
          sql`${employees.password} IS NULL OR ${employees.password} NOT LIKE '$2b$10$%'`
        );

      for (const emp of invalidEmployees) {
        // Update employee password
        await db
          .update(employees)
          .set({
            password: hashedPassword
          })
          .where(eq(employees.id, emp.id));

        // Find matching user by email
        const matchingUser = await db
          .select()
          .from(user)
          .where(eq(user.email, emp.email))
          .limit(1);

        if (matchingUser.length > 0) {
          // Find matching account
          const matchingAccount = await db
            .select()
            .from(account)
            .where(eq(account.userId, matchingUser[0].id))
            .limit(1);

          if (matchingAccount.length > 0) {
            // Update account password
            await db
              .update(account)
              .set({
                password: hashedPassword,
                updatedAt: Math.floor(Date.now() / 1000)
              })
              .where(eq(account.id, matchingAccount[0].id));
          }
        }

        // Only add to fixedEmployees if not already in fixedAccounts
        const alreadyFixed = fixedAccounts.some(fa => fa.email === emp.email);
        if (!alreadyFixed) {
          fixedEmployees.push({
            email: emp.email,
            name: emp.name,
            temporary_password: temporaryPassword
          });
        }
      }
    } catch (error) {
      console.error('Employee query/update error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to process employees: ' + (error as Error).message,
          code: 'EMPLOYEE_PROCESSING_ERROR' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset completed',
        fixed_accounts: fixedAccounts,
        fixed_employees: fixedEmployees,
        total_fixed: fixedAccounts.length + fixedEmployees.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error as Error).message 
      },
      { status: 500 }
    );
  }
}