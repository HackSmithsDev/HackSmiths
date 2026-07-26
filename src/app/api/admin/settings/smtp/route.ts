import { NextRequest, NextResponse } from 'next/server';

let smtpSettings = {
  SMTP_SENDER_IDENTITY: 'HackSmiths Core <noreply@hacksmiths.io>',
  SMTP_REPLY_TO: 'contact@hacksmiths.io',
  ENABLE_APPLICATION_RECEIVED_EMAIL: 'true',
  ENABLE_STATUS_CHANGE_EMAILS: 'true',
};

export async function GET() {
  try {
    return NextResponse.json({ smtp: smtpSettings }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch SMTP settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    smtpSettings = { ...smtpSettings, ...body };

    return NextResponse.json(
      { message: 'SMTP settings updated', smtp: smtpSettings },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update SMTP settings' }, { status: 500 });
  }
}