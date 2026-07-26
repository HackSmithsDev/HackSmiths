import { NextRequest, NextResponse } from 'next/server';

let securitySettings = {
  OTP_EXPIRATION_SECONDS: '300',
  JWT_EXPIRY_DURATION: '7d',
  RATE_LIMIT_PER_MINUTE: '10',
};

export async function GET() {
  try {
    return NextResponse.json({ security: securitySettings }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch security settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    securitySettings = { ...securitySettings, ...body };

    return NextResponse.json(
      { message: 'Security parameters updated', security: securitySettings },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update security settings' }, { status: 500 });
  }
}