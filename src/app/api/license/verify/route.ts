import { NextRequest, NextResponse } from 'next/server';
import { validateLicenseKey } from '@/lib/license';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const key = typeof body?.key === 'string' ? body.key.trim().slice(0, 100) : '';

    if (!key) {
      return NextResponse.json({ valid: false, message: 'Key is required' }, { status: 400 });
    }

    const isValid = await validateLicenseKey(key);

    return NextResponse.json({
      valid: isValid,
      plan: isValid ? 'Lifetime Pass' : undefined,
      message: isValid ? 'Verified successfully' : 'Invalid license key',
    });
  } catch (error) {
    console.error('License validation endpoint error:', error);
    return NextResponse.json({ valid: false, message: 'Error checking license' }, { status: 500 });
  }
}
