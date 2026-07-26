import { NextRequest, NextResponse } from 'next/server';

let recruitmentSettings = {
  RECRUITMENT_OPEN: 'true',
  CURRENT_COHORT_NAME: 'Season 2026-27',
  MAX_APPLICATIONS_CAP: '500',
  SUPPORT_EMAIL: 'support@hacksmiths.io',
};

export async function GET() {
  try {
    return NextResponse.json({ recruitment: recruitmentSettings }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch recruitment settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    recruitmentSettings = { ...recruitmentSettings, ...body };

    return NextResponse.json(
      { message: 'Recruitment settings updated', recruitment: recruitmentSettings },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update recruitment settings' }, { status: 500 });
  }
}