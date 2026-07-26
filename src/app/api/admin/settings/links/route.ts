import { NextRequest, NextResponse } from 'next/server';

let linksSettings = {
  LINK_GITHUB_ORG: 'https://github.com/hacksmiths',
  LINK_DISCORD_INVITE: 'https://discord.gg/hacksmiths',
};

export async function GET() {
  try {
    return NextResponse.json({ links: linksSettings }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch links settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    linksSettings = { ...linksSettings, ...body };

    return NextResponse.json(
      { message: 'Links settings updated', links: linksSettings },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update links settings' }, { status: 500 });
  }
}