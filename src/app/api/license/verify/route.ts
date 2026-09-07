import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const key = typeof body?.key === 'string' ? body.key.trim().slice(0, 120) : '';

    if (!key) {
      return NextResponse.json({ valid: false, message: 'Key is required' }, { status: 400 });
    }

    // 로컬/개발 환경용 마스터 키 검증
    if (process.env.PRO_LICENSE_KEY && key === process.env.PRO_LICENSE_KEY) {
      return NextResponse.json({ valid: true, plan: 'Lifetime Pass' });
    }

    const formData = new FormData();
    formData.append('license_key', key);

    const response = await fetch(
      'https://api.lemonsqueezy.com/v1/licenses/validate',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ valid: false, message: 'Verification request failed' });
    }

    const data = await response.json();
    const valid = Boolean(data && data.valid === true);

    return NextResponse.json({
      valid,
      message: valid ? 'Verified successfully' : 'Invalid license key',
    });
  } catch (error) {
    console.error('License validation endpoint error:', error);
    return NextResponse.json({ valid: false, message: 'Error checking license' }, { status: 500 });
  }
}
